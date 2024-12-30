import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from app.core.config import settings
from app.crud.base import CRUDBase
from app.db.db import type_mapping
from app.models.problems import PostBase, Problem, ProblemItem
from app.models.user import CitizenUser
from app.schemas.problem import (
    Coordinate,
    PostCreate,
    PostResponse,
    PostResponseBase,
    PostUpdate,
    ProblemForPost,
    UserForPost,
)
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import Boolean, DateTime, Integer, Text, or_
from sqlalchemy.orm import Session


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


def validate_datetime(value: str) -> Optional[datetime]:
    try:
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None


class CRUDPost(CRUDBase[PostBase, PostCreate, PostUpdate]):
    def validate_post_items(
        self, db_session: Session, problem_id: int, items: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        投稿項目の検証と型変換を行う
        """

        problem = db_session.query(Problem).filter_by(id=problem_id).first()
        if not problem:
            raise HTTPException(
                status_code=404, detail="指定された課題が見つかりません"
            )
        if not problem.is_open:
            raise HTTPException(
                status_code=400, detail="この課題は現在募集を行っていません"
            )

        problem_items = {
            item.name: item
            for item in db_session.query(ProblemItem)
            .filter_by(problem_id=problem_id)
            .all()
        }

        validated_values = items.copy()

        for item_name, problem_item in problem_items.items():
            if item_name not in validated_values:
                raise HTTPException(
                    status_code=400, detail=f"必須項目 '{item_name}' が含まれていません"
                )

            value = validated_values[item_name]
            if not value and problem_item.required:
                raise HTTPException(
                    status_code=400, detail=f"項目 '{item_name}' が空です"
                )

            expected_type = type_mapping[problem_item.type_id]
            actual_type = get_type_class(value)

            if expected_type != actual_type:
                if expected_type == DateTime:
                    converted_value = validate_datetime(value)
                    if converted_value is None:
                        raise HTTPException(
                            status_code=400,
                            detail=f"項目 '{item_name}' の日時形式が正しくありません",
                        )
                    validated_values[item_name] = converted_value
                else:
                    raise HTTPException(
                        status_code=400, detail=f"項目 '{item_name}' の型が一致しません"
                    )

        return validated_values

    def create_post(
        self,
        db_session: Session,
        problem_id: int,
        user_id: uuid.UUID,
        post_in: PostCreate,
    ) -> PostResponse:
        """
        動的テーブルに新しい投稿を作成
        """
        try:
            items = jsonable_encoder(post_in.items)
            item_values = self.validate_post_items(db_session, problem_id, items)

            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            id = uuid.uuid4()

            post_data = dynamic_table(
                id=id,
                problem_id=problem_id,
                latitude=post_in.latitude,
                longitude=post_in.longitude,
                user_id=user_id,
                is_solved=post_in.is_solved,
                created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                created_by=str(user_id),
                **item_values,
            )
            db_session.add(post_data)
            db_session.commit()

            post = db_session.query(dynamic_table).filter_by(id=id).first()

            if not post:
                raise HTTPException(
                    status_code=404, detail="指定された投稿が見つかりません"
                )

            post_data = jsonable_encoder(post)
            user = (
                db_session.query(CitizenUser).filter_by(id=post_data["user_id"]).first()
            )
            if user is None:
                raise HTTPException(
                    status_code=404, detail="指定されたユーザーが見つかりません"
                )
            post_user = UserForPost(id=user.id, username=user.name)

            problem = (
                db_session.query(Problem).filter_by(id=post_data["problem_id"]).first()
            )
            if problem is None:
                raise HTTPException(
                    status_code=404, detail="指定された課題が見つかりません"
                )
            post_problem = ProblemForPost(
                id=problem.id, name=problem.name, is_open=problem.is_open
            )

            problem_items = (
                db_session.query(ProblemItem).filter_by(problem_id=problem_id).all()
            )
            items = {}
            for item in problem_items:
                items[item.name] = post_data[item.name]
            print("🐰")
            print(items)
            return PostResponse(
                id=post_data["id"],
                is_solved=post_data["is_solved"],
                problem=post_problem,
                user=post_user,
                coodinate=Coordinate(
                    latitude=post_data["latitude"],
                    longitude=post_data["longitude"],
                ),
                items=items,
                created_at=post_data["created_at"],
                updated_at=post_data["updated_at"],
            )

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の作成中にエラーが発生しました: {str(e)}",
                )

    def get_post(
        self,
        db_session: Session,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 100,
        summary: bool = False,
        user_type: str = "citizen",
    ) -> List[Dict[str, Any]]:
        """
        全ての投稿を取得
        """
        try:
            if "is_open" in filters:
                problems = (
                    db_session.query(Problem)
                    .filter_by(is_open=filters["is_open"])
                    .all()
                )
            else:
                problems = db_session.query(Problem).all()

            if "problem_id" in filters:
                open_problem = [filters["problem_id"]]
            else:
                open_problem = [problem.id for problem in problems]

            res = []
            for problem_id in open_problem:
                dynamic_table = self.get_dynamic_table(db_session, problem_id)

                if user_type == "staff":
                    query = db_session.query(dynamic_table)
                    if "is_solved" in filters:
                        query = query.filter(
                            getattr(dynamic_table, "is_solved") == filters["is_solved"]
                        )
                    if "user_id" in filters:
                        query = query.filter(
                            getattr(dynamic_table, "user_id") == filters["user_id"]
                        )

                    posts = query.offset(skip).limit(limit).all()
                    res.extend([jsonable_encoder(post) for post in posts])

                elif user_type == "citizen":
                    now = datetime.now()
                    two_months_ago = now - timedelta(days=settings.POST_LIMIT_DAYS)
                    posts = (
                        db_session.query(dynamic_table)
                        .filter(
                            or_(
                                dynamic_table.is_solved,
                                dynamic_table.created_at.between(two_months_ago, now),
                            )
                        )
                        .all()
                    )
                    res.extend([jsonable_encoder(post) for post in posts])

            return res

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}",
                )

    def get_post_summary(
        self,
        db_session: Session,
        filters: Dict[str, Union[int, bool, UUID]],
        skip: int = 0,
        limit: int = 100,
        user_type: str = "staff",
    ) -> List[PostResponseBase]:
        """
        全ての投稿を取得
        """
        try:
            if "is_open" in filters:
                problems = (
                    db_session.query(Problem)
                    .filter_by(is_open=filters["is_open"])
                    .all()
                )
            else:
                problems = db_session.query(Problem).all()

            if "problem_id" in filters:
                open_problem = [int(filters["problem_id"])]
            else:
                open_problem = [problem.id for problem in problems]

            res = []
            for problem_id in open_problem:
                dynamic_table = self.get_dynamic_table(db_session, problem_id)

                query = db_session.query(dynamic_table)
                if "is_solved" in filters:
                    query = query.filter(
                        getattr(dynamic_table, "is_solved") == filters["is_solved"]
                    )
                if "user_id" in filters:
                    query = query.filter(
                        getattr(dynamic_table, "user_id") == filters["user_id"]
                    )

                posts = query.offset(skip).limit(limit).all()

                for post in posts:
                    post_data = jsonable_encoder(post)
                    user = (
                        db_session.query(CitizenUser)
                        .filter_by(id=post_data["user_id"])
                        .first()
                    )
                    if user is None:
                        raise HTTPException(
                            status_code=404, detail="指定されたユーザーが見つかりません"
                        )
                    post_user = UserForPost(id=user.id, username=user.name)

                    problem = (
                        db_session.query(Problem)
                        .filter_by(id=post_data["problem_id"])
                        .first()
                    )
                    if problem is None:
                        raise HTTPException(
                            status_code=404, detail="指定された課題が見つかりません"
                        )
                    post_problem = ProblemForPost(
                        id=problem.id, name=problem.name, is_open=problem.is_open
                    )

                    summary = PostResponseBase(
                        id=post_data["id"],
                        is_solved=post_data["is_solved"],
                        problem=post_problem,
                        user=post_user if user_type == "staff" else None,
                        coodinate=Coordinate(
                            latitude=post_data["latitude"],
                            longitude=post_data["longitude"],
                        ),
                        created_at=post_data["created_at"],
                        updated_at=post_data["updated_at"],
                    )
                    res.append(summary)
            return res

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}",
                )

    def get_by_id(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_type: str,
    ) -> PostResponse:
        """
        特定の投稿を取得
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(
                    status_code=404, detail="指定された投稿が見つかりません"
                )

            post_data = jsonable_encoder(post)
            user = (
                db_session.query(CitizenUser).filter_by(id=post_data["user_id"]).first()
            )
            if user is None:
                raise HTTPException(
                    status_code=404, detail="指定されたユーザーが見つかりません"
                )
            post_user = UserForPost(id=user.id, username=user.name)

            problem = (
                db_session.query(Problem).filter_by(id=post_data["problem_id"]).first()
            )
            if problem is None:
                raise HTTPException(
                    status_code=404, detail="指定された課題が見つかりません"
                )
            post_problem = ProblemForPost(
                id=problem.id, name=problem.name, is_open=problem.is_open
            )

            problem_items = (
                db_session.query(ProblemItem).filter_by(problem_id=problem_id).all()
            )
            items = {}
            for item in problem_items:
                items[item.name] = post_data[item.name]

            return PostResponse(
                id=post_data["id"],
                is_solved=post_data["is_solved"],
                problem=post_problem,
                user=post_user,
                coodinate=Coordinate(
                    latitude=post_data["latitude"],
                    longitude=post_data["longitude"],
                ),
                items=items,
                created_at=post_data["created_at"],
                updated_at=post_data["updated_at"],
            )

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の取得中にエラーが発生しました: {str(e)}",
                )

    def update_post(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: uuid.UUID,
        update_data: PostUpdate,
    ) -> Dict[str, Any]:
        """
        投稿を更新
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(
                    status_code=404, detail="指定された投稿が見つかりません"
                )

            if post.user_id != user_id:
                raise HTTPException(
                    status_code=403, detail="この投稿を更新する権限がありません"
                )

            if post.is_solved:
                raise HTTPException(
                    status_code=400, detail="この投稿は既に解決済みです"
                )

            obj_data = jsonable_encoder(post)
            update_data_dict = update_data.dict(exclude_unset=True)

            if "items" in update_data_dict:
                items = update_data_dict.pop("items")
                for key, value in items.items():
                    update_data_dict[key] = value

            update_data_dict["updated_at"] = datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            update_data_dict["updated_by"] = str(user_id)

            for field in obj_data:
                if field in update_data:
                    setattr(post, field, update_data_dict[field])

            db_session.add(post)
            db_session.commit()
            db_session.refresh(post)

            res: Dict[str, Any] = jsonable_encoder(post)
            return res

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の更新中にエラーが発生しました: {str(e)}",
                )

    def patch(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: int,
        update_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        is_solvedを更新(自治体User用)
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(
                    status_code=404, detail="指定された投稿が見つかりません"
                )

            obj_data = jsonable_encoder(post)

            update_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            update_data["updated_by"] = str(user_id)
            for field in obj_data:
                if field in update_data:
                    setattr(post, field, update_data[field])

            db_session.add(post)
            db_session.commit()
            db_session.refresh(post)

            res: Dict[str, Any] = jsonable_encoder(post)
            return res

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の更新中にエラーが発生しました: {str(e)}",
                )

    def delete_post(
        self,
        db_session: Session,
        *,
        problem_id: int,
        post_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Dict[str, Any]:
        """
        投稿を削除
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = db_session.query(dynamic_table).filter_by(id=post_id).first()

            if not post:
                raise HTTPException(
                    status_code=404, detail="指定された投稿が見つかりません"
                )

            if post.user_id != user_id:
                raise HTTPException(
                    status_code=403, detail="この投稿を削除する権限がありません"
                )

            db_session.delete(post)
            db_session.commit()

            res: Dict[str, Any] = jsonable_encoder(post)
            return res

        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"投稿の削除中にエラーが発生しました: {str(e)}",
                )


crud_post = CRUDPost(PostBase)
