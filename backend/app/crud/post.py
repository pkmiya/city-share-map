from typing import Optional, Dict, Any, List, Type
from sqlalchemy.ext.automap import automap_base
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import Integer, Boolean, DateTime, Text
from fastapi import HTTPException
from app.crud.base import CRUDBase
from app.models.problems import PostBase, Problem, ProblemItem
from app.schemas.problem import PostCreate, PostUpdate
from app.models.user import User
from app.models.user import CitizenUser
from app.db.db import type_mapping
from datetime import datetime
import uuid
import decimal


def get_type_class(value: Any) -> type:
    if isinstance(value, bool):
        return Boolean
    elif isinstance(value, int):
        return Integer
    elif isinstance(value, datetime):
        return DateTime
    elif isinstance(value, str):
        return Text
    else:
        raise HTTPException(status_code=400, detail="サポートされていないデータ型です")

def validate_datetime(value: str) -> datetime:
    try:
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

class CRUDPost(CRUDBase[PostBase, PostCreate, PostUpdate]):        
    def validate_post_items(
        self,
        db_session: Session,
        problem_id: int,
        items: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        投稿項目の検証と型変換を行う
        """

        problem = db_session.query(Problem).filter_by(id=problem_id).first()
        if not problem:
            raise HTTPException(status_code=404, detail="指定された課題が見つかりません")
        if not problem.is_open:
            raise HTTPException(status_code=400, detail="この課題は現在募集を行っていません")

        problem_items = {
            item.name: item for item in 
            db_session.query(ProblemItem).filter_by(problem_id=problem_id).all()
        }

        validated_values = items.copy()
        
        for item_name, problem_item in problem_items.items():
            if item_name not in validated_values:
                raise HTTPException(
                    status_code=400,
                    detail=f"必須項目 '{item_name}' が含まれていません"
                )
            
            value = validated_values[item_name]
            if not value and problem_item.required:
                raise HTTPException(
                    status_code=400,
                    detail=f"項目 '{item_name}' が空です"
                )
            
            expected_type = type_mapping[problem_item.type_id]
            actual_type = get_type_class(value)

            if expected_type != actual_type:
                if expected_type == DateTime:
                    converted_value = validate_datetime(value)
                    if converted_value is None:
                        raise HTTPException(
                            status_code=400,
                            detail=f"項目 '{item_name}' の日時形式が正しくありません"
                        )
                    validated_values[item_name] = converted_value
                else:
                    raise HTTPException(
                        status_code=400,
                        detail=f"項目 '{item_name}' の型が一致しません"
                    )

        return validated_values

    def create(
        self,
        db_session: Session,
        *,
        problem_id: int,
        user_id: uuid.UUID,
        post_in: PostCreate,
    ) -> str:
        """
        動的テーブルに新しい投稿を作成
        """
        try:
            items = jsonable_encoder(post_in.items)
            item_values = self.validate_post_items(db_session, problem_id, items)
                
            dynamic_table = self.get_dynamic_table(db_session, problem_id)

            post_data = dynamic_table(
                id=uuid.uuid4(),
                problem_id=problem_id,
                latitude=post_in.latitude,
                longitude=post_in.longitude,
                user_id=user_id,
                is_solved=post_in.is_solved,
                created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                created_by=str(user_id),
                **item_values
            )
            db_session.add(post_data)
            db_session.commit()

            return "success"

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の作成中にエラーが発生しました: {str(e)}"
                )

    def get(
        self,
        db_session: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        全ての投稿を取得
        """
        try:
            if 'is_open' in filters:
                problems = db_session.query(Problem).filter_by(is_open=filters["is_open"]).all()
            else:
                problems = db_session.query(Problem).all()
            
            if 'problem_id' in filters:
                open_problem = [filters['problem_id']]
            else:
                open_problem = [problem.id for problem in problems]            

            res=[]
            for problem_id in open_problem:
                dynamic_table = self.get_dynamic_table(db_session, problem_id)

                query = db_session.query(dynamic_table)
                if 'is_solved' in filters:
                    query = query.filter(getattr(dynamic_table, 'is_solved') == filters['is_solved'])
                if 'user_id' in filters:
                    query = query.filter(getattr(dynamic_table, 'user_id') == filters['user_id'])
            
                posts = query.offset(skip).limit(limit).all()
                res.extend([jsonable_encoder(post) for post in posts])
            
            return res


        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}"
                )
    
    def get_by_id(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID
    ) -> Optional[Dict[str, Any]]:
        """
        特定の投稿を取得
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")

            return jsonable_encoder(post)

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}"
                )

    def update(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: uuid.UUID,
        update_data: PostUpdate
    ) -> Dict[str, Any]:
        """
        投稿を更新
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")
            
            if post.user_id != user_id:
                raise HTTPException(status_code=403, detail="この投稿を更新する権限がありません")
            
            if post.is_solved:
                raise HTTPException(status_code=400, detail="この投稿は既に解決済みです")

            obj_data = jsonable_encoder(post)
            update_data = update_data.dict(exclude_unset=True)

            if "items" in update_data:
                items = update_data.pop("items")
                for key, value in items.items():
                    update_data[key] = value
            
            update_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            update_data["updated_by"] = str(user_id)
            
            for field in obj_data:
                if field in update_data:
                    setattr(post, field, update_data[field])

            db_session.add(post)
            db_session.commit()
            db_session.refresh(post)

            return jsonable_encoder(post)

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の更新中にエラーが発生しました: {str(e)}"
                )
    
    def patch(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: int,
        update_data: Dict[str, bool]
    ) -> Dict[str, Any]:
        """
        is_solvedを更新(自治体User用)
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")

            obj_data = jsonable_encoder(post)
            
            update_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            update_data["updated_by"] = str(user_id)            
            for field in obj_data:
                if field in update_data:
                    setattr(post, field, update_data[field])

            db_session.add(post)
            db_session.commit()
            db_session.refresh(post)

            return jsonable_encoder(post)

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の更新中にエラーが発生しました: {str(e)}"
                )

    def delete(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: uuid.UUID
    ) -> Dict[str, Any]:
        """
        投稿を削除
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")
            
            if post.user_id != user_id:
                raise HTTPException(status_code=403, detail="この投稿を削除する権限がありません")

            db_session.delete(post)
            db_session.commit()

            return jsonable_encoder(post)

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の削除中にエラーが発生しました: {str(e)}"
                )


crud_post = CRUDPost(PostBase)