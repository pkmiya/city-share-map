import uuid
from typing import Dict, List, Optional, Union
from uuid import UUID

from app.api.deps import (
    CurrentAllUser,
    CurrentCitizenUser,
    CurrentStaffUser,
    SessionDep,
)
from app.crud.post import crud_post
from app.schemas.post import (
    PostCreate,
    PostMapResponse,
    PostResponse,
    PostResponseBase,
    PostUpdate,
)
from fastapi import APIRouter

router = APIRouter()


@router.post("/{problem_id}", response_model=PostResponse)
def create_post(
    *,
    db: SessionDep,
    problem_id: int,
    current_user: CurrentCitizenUser,
    # current_user: CurrentStaffUser,
    post_in: PostCreate
) -> PostResponse:
    """
    新しい投稿を作成
    """
    return crud_post.create_post(
        db_session=db, problem_id=problem_id, user_id=current_user.id, post_in=post_in
    )


@router.get("/map", response_model=List[PostMapResponse])
def get_posts_map(
    db: SessionDep,
    current_user: CurrentAllUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
    problem_id: Optional[int] = None,
    user_id: Optional[UUID] = None,
) -> List[PostMapResponse]:
    """
    投稿の一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters: Dict[str, Union[int, bool, UUID]] = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    if problem_id is not None:
        filters["problem_id"] = problem_id

    if user_id is not None:
        filters["user_id"] = user_id

    if isinstance(current_user.id, int):
        user_type = "staff"
    else:
        user_type = "citizen"

    return crud_post.get_post_for_map(
        db_session=db,
        skip=skip,
        limit=limit,
        filters=filters,
        user_type=user_type,
    )


@router.get("/summary", response_model=List[PostResponseBase])
def get_posts_summary(
    db: SessionDep,
    current_user: CurrentStaffUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
    problem_id: Optional[int] = None,
    user_id: Optional[UUID] = None,
) -> List[PostResponseBase]:
    """
    投稿の一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters: Dict[str, Union[int, bool, UUID]] = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    if problem_id is not None:
        filters["problem_id"] = problem_id

    if user_id is not None:
        filters["user_id"] = user_id

    return crud_post.get_post_summary(
        db_session=db,
        skip=skip,
        limit=limit,
        filters=filters,
        user_type="staff",
    )


@router.get("/me", response_model=List[PostResponseBase])
def get_posts_summary_me(
    db: SessionDep,
    current_user: CurrentCitizenUser,
    # current_user: CurrentStaffUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
    problem_id: Optional[int] = None,
) -> List[PostResponseBase]:
    """
    Userが投稿したレポートの一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters: Dict[str, Union[int, bool, UUID]] = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    if problem_id is not None:
        filters["problem_id"] = problem_id

    filters["user_id"] = current_user.id
    # filters["user_id"] = mock_id

    return crud_post.get_post_summary(
        db_session=db,
        skip=skip,
        limit=limit,
        filters=filters,
        user_type="citizen",
    )


@router.get(
    "/detail/{problem_id}/{post_id}",
    response_model=PostResponse,
)
def get_post_by_id(
    problem_id: int,
    db: SessionDep,
    current_user: CurrentAllUser,
    post_id: uuid.UUID,
) -> PostResponse:
    """
    IDによる投稿の取得
    """
    if isinstance(current_user.id, int):
        user_type = "staff"
    else:
        user_type = "citizen"

    return crud_post.get_by_id(
        db_session=db, problem_id=problem_id, post_id=post_id, user_type=user_type
    )


@router.put("/detail/{problem_id}/{post_id}", response_model=PostResponse)
def update_post(
    problem_id: int,
    post_id: uuid.UUID,
    *,
    db: SessionDep,
    current_user: CurrentCitizenUser,
    # current_user: CurrentStaffUser,
    update_data: PostUpdate
) -> PostResponse:
    """
    投稿を更新
    """

    return crud_post.update_post(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=current_user.id,
        update_data=update_data,
    )


@router.delete("/detail/{problem_id}/{post_id}", response_model=PostResponse)
def delete_post(
    problem_id: int,
    post_id: uuid.UUID,
    db: SessionDep,
    current_user: CurrentAllUser,
) -> PostResponse:
    """
    投稿を削除
    """
    if isinstance(current_user.id, int):
        user_type = "staff"
    else:
        user_type = "citizen"

    return crud_post.delete_post(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=current_user.id,
        user_type=user_type,
    )


@router.patch(
    "/detail/{problem_id}/{post_id}/solve",
    response_model=PostResponse,
)
def mark_as_solved(
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentStaffUser
) -> PostResponse:
    """
    投稿を解決済みとしてマーク
    """

    return crud_post.patch(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=current_user.id,
        update_data={"is_solved": True},
    )


@router.patch(
    "/detail/{problem_id}/{post_id}/unsolve",
    response_model=PostResponse,
)
def mark_as_unsolved(
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentStaffUser
) -> PostResponse:
    """
    投稿を未解決としてマーク
    """

    return crud_post.patch(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=current_user.id,
        update_data={"is_solved": False},
    )
