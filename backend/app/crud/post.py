import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from app.core.config import settings
from app.crud.base import CRUDBase
from app.db.db import type_mapping
from app.models.problems import PostBase, Problem, ProblemItem
from app.models.user import CitizenUser
from app.schemas.post import (
    Coordinate,
    PostCreate,
    PostMapResponse,
    PostResponse,
    PostResponseBase,
    PostUpdate,
    ProblemForPost,
    ProblemMapResponse,
    UserForPost,
)
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import Boolean, DateTime, Integer, Text, or_
from sqlalchemy.orm import Session


class CRUDPost(CRUDBase[PostBase, PostCreate, PostUpdate]):
    """
    投稿管理クラス
    - 投稿内容の検証、作成、取得、更新を行う
    """

    @staticmethod
    def _get_type_class(value: Any) -> type:
        type_mapping = {
            bool: Boolean,
            int: Integer,
            datetime: DateTime,
            str: Text,
        }
        for py_type, sa_type in type_mapping.items():
            if isinstance(value, py_type):
                return sa_type
        raise HTTPException(status_code=400, detail="サポートされていないデータ型です")

    @staticmethod
    def _validate_datetime(value: str) -> Optional[datetime]:
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return None

    def _validate_post_items(
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
            actual_type = self._get_type_class(value)

            if expected_type != actual_type:
                if expected_type == DateTime:
                    converted_value = self._validate_datetime(value)
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

    def _get_problem(self, db_session: Session, problem_id: int) -> Problem:
        """問題を取得し、存在確認を行う"""
        problem = db_session.query(Problem).filter_by(id=problem_id).first()
        if not problem:
            raise HTTPException(
                status_code=404, detail="指定された課題が見つかりません"
            )
        return problem

    def _get_user(self, db_session: Session, user_id: UUID) -> CitizenUser:
        """ユーザーを取得し、存在確認を行う"""
        user = db_session.query(CitizenUser).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        return user

    def _get_post(self, db_session: Session, dynamic_table: Any, post_id: UUID) -> Any:
        """投稿を取得し、存在確認を行う"""
        post = db_session.query(dynamic_table).filter_by(id=post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="投稿が見つかりません")
        return post

    def _build_base_post_response(
        self,
        db_session: Session,
        post_data: Any,
        user_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """基本的な投稿レスポンスデータを構築"""
        user = self._get_user(db_session, post_data["user_id"])
        problem = self._get_problem(db_session, post_data["problem_id"])

        return {
            "id": post_data["id"],
            "is_solved": post_data["is_solved"],
            "problem": ProblemForPost(
                id=problem.id, name=problem.name, is_open=problem.is_open
            ),
            "user": (UserForPost(id=user.id, name=user.name)),
            "coodinate": Coordinate(
                latitude=post_data["latitude"], longitude=post_data["longitude"]
            ),
            "created_at": post_data["created_at"],
            "updated_at": post_data["updated_at"] if user_type != "citizen" else None,
            "updated_by": post_data["updated_by"] if user_type != "citizen" else None,
        }

    def _build_post_summary_response(
        self,
        db_session: Session,
        dynamic_table: Any,
        post_id: UUID,
        user_type: Optional[str] = None,
    ) -> PostResponseBase:
        """投稿データからレスポンスを構築"""
        post = self._get_post(db_session, dynamic_table, post_id)
        post_data = jsonable_encoder(post)

        base_response = self._build_base_post_response(db_session, post_data, user_type)

        return PostResponseBase(**base_response)

    def _build_post_map_response(
        self,
        db_session: Session,
        dynamic_table: Any,
        post_id: UUID,
        user_type: Optional[str] = None,
    ) -> PostMapResponse:
        """投稿データからレスポンスを構築"""
        post = self._get_post(db_session, dynamic_table, post_id)
        post_data = jsonable_encoder(post)

        base_response = self._build_base_post_response(db_session, post_data, user_type)

        problem_items = (
            db_session.query(ProblemItem)
            .filter_by(problem_id=base_response["problem"].id)
            .all()
        )

        photo_field = None
        descriptions = None

        for item in problem_items:
            if item.type_id == 1:
                descriptions = ProblemMapResponse(
                    name=item.name, value=post_data[item.name]
                )
            elif item.type_id == 2:
                photo_field = ProblemMapResponse(
                    name=item.name, value=post_data[item.name]
                )

        return PostMapResponse(
            **base_response, photo_field=photo_field, descriptions=descriptions
        )

    def _build_post_response(
        self,
        db_session: Session,
        dynamic_table: Any,
        post_id: UUID,
        user_type: Optional[str] = None,
    ) -> PostResponse:
        """投稿データからレスポンスを構築"""

        post = self._get_post(db_session, dynamic_table, post_id)
        post_data = jsonable_encoder(post)

        base_response = self._build_base_post_response(db_session, post_data, user_type)

        problem_items = (
            db_session.query(ProblemItem)
            .filter_by(problem_id=base_response["problem"].id)
            .all()
        )
        items = {item.name: post_data[item.name] for item in problem_items}

        return PostResponse(**base_response, items=items)

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
        items = jsonable_encoder(post_in.items)
        validated_items = self._validate_post_items(db_session, problem_id, items)

        dynamic_table = self.get_dynamic_table(db_session, problem_id)
        post_id = uuid.uuid4()
        post_data = dynamic_table(
            id=post_id,
            problem_id=problem_id,
            latitude=post_in.latitude,
            longitude=post_in.longitude,
            user_id=user_id,
            is_solved=post_in.is_solved,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            created_by=str(user_id),
            **validated_items,
        )

        db_session.add(post_data)
        db_session.commit()

        response: PostResponse = self._build_post_response(
            db_session, dynamic_table, post_id
        )

        return response

    def get_post_for_map(
        self,
        db_session: Session,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 100,
        user_type: str = "citizen",
    ) -> List[PostMapResponse]:
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

            response = []
            for idx, problem_id in enumerate(open_problem):
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
                    if (
                        "user_id" in filters
                        and not posts
                        and idx == len(open_problem) - 1
                    ):
                        raise HTTPException(
                            status_code=404,
                            detail=f"指定されたuser_id: {filters['user_id']} の投稿が見つかりませんでした",
                        )

                elif user_type == "citizen":
                    now = datetime.now()
                    two_months_ago = now - timedelta(days=settings.POST_LIMIT_DAYS)
                    query = db_session.query(dynamic_table)
                    if "is_solved" in filters:
                        query = query.filter(
                            getattr(dynamic_table, "is_solved") == filters["is_solved"]
                        )
                    posts = query.filter(
                        or_(
                            dynamic_table.is_solved,
                            dynamic_table.created_at.between(two_months_ago, now),
                        )
                    ).all()

                for post in posts:
                    res = self._build_post_map_response(
                        db_session, dynamic_table, post.id, user_type
                    )
                    response.append(res)

            return response

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

            response = []
            for idx, problem_id in enumerate(open_problem):
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
                if "user_id" in filters and not posts and idx == len(open_problem) - 1:
                    raise HTTPException(
                        status_code=404,
                        detail=f"指定されたuser_id: {filters['user_id']} の投稿が見つかりませんでした",
                    )
                for post in posts:
                    res = self._build_post_summary_response(
                        db_session, dynamic_table, post.id, user_type
                    )
                    response.append(res)

            return response

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
            response = self._build_post_response(
                db_session, dynamic_table, post_id, user_type
            )

            return response

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
    ) -> PostResponse:
        """
        投稿を更新
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = self._get_post(db_session, dynamic_table, post_id)

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

            response = self._build_post_response(db_session, dynamic_table, post.id)
            return response

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
    ) -> PostResponse:
        """
        is_solvedを更新(自治体User用)
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = self._get_post(db_session, dynamic_table, post_id)
            obj_data = jsonable_encoder(post)

            update_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            update_data["updated_by"] = str(user_id)
            for field in obj_data:
                if field in update_data:
                    setattr(post, field, update_data[field])

            db_session.add(post)
            db_session.commit()
            db_session.refresh(post)

            response = self._build_post_response(db_session, dynamic_table, post.id)
            return response

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
    ) -> PostResponse:
        """
        投稿を削除
        """
        try:
            dynamic_table = self.get_dynamic_table(db_session, problem_id)
            post = self._get_post(db_session, dynamic_table, post_id)

            if user_type == "citizen" & post.user_id != user_id:
                raise HTTPException(
                    status_code=403, detail="この投稿を削除する権限がありません"
                )

            response = self._build_post_response(db_session, dynamic_table, post_id)

            db_session.delete(post)
            db_session.commit()

            return response

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
