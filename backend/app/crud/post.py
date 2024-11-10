from typing import Optional, Dict, Any, List, Type
from sqlalchemy.ext.automap import automap_base
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import Table, MetaData
from app.crud.base import CRUDBase
from app.models.problems import PostBase, Problem, ProblemItem
from app.schemas.problem import PostCreate, PostUpdate
from app.models.user import User
from app.models.user import CitizenUser
from fastapi import HTTPException
from datetime import datetime
import uuid

class CRUDPost(CRUDBase[PostBase, PostCreate, PostUpdate]):
    def get_dynamic_table(self, db_session: Session, problem_id: int) -> Type[PostBase]:
        """
        問題IDに対応する動的テーブルをORMモデルとして取得
        """
        
        table_name = f"post_{problem_id}"
        Base = automap_base()
        Base.prepare(db_session.get_bind(), reflect=True)

        if table_name in Base.classes:
            return Base.classes[table_name]
        else:
            raise HTTPException(status_code=404, detail=f"テーブル '{table_name}' が見つかりません")

    def create(
        self,
        db_session: Session,
        *,
        problem_id: int,
        # user_id: uuid.UUID,
        user_id: User,
        post_in: PostCreate,
    ) -> str:
        """
        動的テーブルに新しい投稿を作成
        """
        try:
            problem = db_session.query(Problem).filter_by(id=problem_id).first()
            if not problem:
                raise HTTPException(status_code=404, detail="指定された課題が見つかりません")
            if not problem.is_open:
                raise HTTPException(status_code=400, detail="この課題は現在募集を行っていません")

            problem_items = db_session.query(ProblemItem).filter_by(problem_id=problem_id).all()
            item_names = {item.name for item in problem_items}
            
            item_values = jsonable_encoder(post_in.items)
            for item_name in item_names:
                if item_name not in item_values:
                    raise HTTPException(
                        status_code=400,
                        detail=f"必須項目 '{item_name}' が含まれていません"
                    )
                
            dynamic_table = self.get_dynamic_table(db_session, problem_id)

            post_data = dynamic_table(
                id=uuid.uuid4(),
                problem_id=problem_id,
                latitude=post_in.latitude,
                longitude=post_in.longitude,
                # user_id=user_id,
                user_id=uuid.UUID("00000000-1111-0000-0000-000000000000"),
                is_solved=post_in.is_solved,
                created_at=datetime.utcnow(),
                # created_by=str(user_id.id),
                created_by="00000000",
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
    
    def get_multi(
        self,
        db_session: Session,
        *,
        problem_id: int,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        problemごとの投稿を取得
        """
        try:
            problem = db_session.query(Problem).filter_by(id=problem_id).first()

            if not problem:
                raise HTTPException(status_code=404, detail="指定された課題が見つかりません")
            
            dynamic_table = self.get_dynamic_table(db_session, problem_id)

            query = db_session.query(dynamic_table)
            if 'is_solved' in filters:
                query = query.filter(getattr(dynamic_table, 'is_solved') == filters['is_solved'])
            posts = query.offset(skip).limit(limit).all()

            return [jsonable_encoder(post) for post in posts]

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}"
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

            if not problems:
                raise HTTPException(status_code=404, detail="指定された課題が見つかりません")

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


    # def update(
    #     self,
    #     db_session: Session,
    #     *,
    #     problem_id: int,
    #     post_id: uuid.UUID,
    #     user_id: uuid.UUID,
    #     update_data: Dict[str, Any]
    # ) -> Dict[str, Any]:
    #     """
    #     投稿を更新
    #     """
    #     try:
    #         dynamic_table = self.get_dynamic_table(db_session, problem_id)
            
    #         # 投稿の存在確認と所有者チェック
    #         existing_post = db_session.execute(
    #             dynamic_table.select().where(dynamic_table.c.id == post_id)
    #         ).first()

    #         if not existing_post:
    #             raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")
            
    #         if existing_post.user_id != user_id:
    #             raise HTTPException(status_code=403, detail="この投稿を更新する権限がありません")

    #         # 更新データの準備
    #         update_data["updated_by"] = str(user_id)

    #         # 投稿の更新
    #         db_session.execute(
    #             dynamic_table.update()
    #             .where(dynamic_table.c.id == post_id)
    #             .values(**update_data)
    #         )
    #         db_session.commit()

    #         # 更新された投稿を取得
    #         updated_post = db_session.execute(
    #             dynamic_table.select().where(dynamic_table.c.id == post_id)
    #         ).first()

    #         return dict(updated_post)

    #     except Exception as e:
    #         db_session.rollback()
    #         if isinstance(e, HTTPException):
    #             raise e
    #         else:
    #             raise HTTPException(
    #                 status_code=500,
    #                 detail=f"投稿の更新中にエラーが発生しました: {str(e)}"
    #             )

    # def delete(
    #     self,
    #     db_session: Session,
    #     *,
    #     problem_id: int,
    #     post_id: uuid.UUID,
    #     user_id: uuid.UUID
    # ) -> Dict[str, Any]:
    #     """
    #     投稿を削除（論理削除）
    #     """
    #     try:
    #         dynamic_table = self.get_dynamic_table(db_session, problem_id)
            
    #         # 投稿の存在確認と所有者チェック
    #         existing_post = db_session.execute(
    #             dynamic_table.select().where(dynamic_table.c.id == post_id)
    #         ).first()

    #         if not existing_post:
    #             raise HTTPException(status_code=404, detail="指定された投稿が見つかりません")
            
    #         if existing_post.user_id != user_id:
    #             raise HTTPException(status_code=403, detail="この投稿を削除する権限がありません")

    #         # 論理削除の実行
    #         from datetime import datetime
    #         db_session.execute(
    #             dynamic_table.update()
    #             .where(dynamic_table.c.id == post_id)
    #             .values(
    #                 deleted_at=datetime.utcnow(),
    #                 updated_by=str(user_id)
    #             )
    #         )
    #         db_session.commit()

    #         return {"message": "投稿が正常に削除されました"}

    #     except Exception as e:
    #         db_session.rollback()
    #         if isinstance(e, HTTPException):
    #             raise e
    #         else:
    #             raise HTTPException(
    #                 status_code=500,
    #                 detail=f"投稿の削除中にエラーが発生しました: {str(e)}"
    #             )


crud_post = CRUDPost(PostBase)