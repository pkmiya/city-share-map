from typing import Dict, Any
from fastapi import APIRouter
from app.api.deps import CurrentAdminUser, SessionDep
from app.crud.post import crud_post
from app.schemas.problem import PostCreate, PostUpdate
import uuid
from typing import Optional, List


router = APIRouter()
mock_id = uuid.UUID("00000000-0000-0000-0000-000000000000")  # モック用のID


@router.get("/", response_model=List[Dict[str, Any]])
def list_posts_by_citizen(
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
    problem_id: Optional[int] = None,
    user_id: Optional[uuid.UUID] = None,
):
    """
    投稿の一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    if problem_id is not None:
        filters["problem_id"] = problem_id

    if user_id is not None:
        filters["user_id"] = user_id

    return crud_post.get(db_session=db, skip=skip, limit=limit, filters=filters)


@router.get("/me", response_model=List[Dict[str, Any]])
def get_posts_me(
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
):
    """
    Userが投稿したレポートの一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    # filters["user_id"] = current_user.id
    filters["user_id"] = uuid.UUID("00000000-0000-0000-0000-000000000000")

    return crud_post.get(db_session=db, skip=skip, limit=limit, filters=filters)


@router.post("/{problem_id}", response_model=Dict[str, Any])
def create_post(
    *,
    db: SessionDep,
    problem_id: int,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
    post_in: PostCreate
):
    """
    新しい投稿を作成
    """
    return crud_post.create(
        db_session=db, problem_id=problem_id, user_id=mock_id, post_in=post_in
    )


@router.get("/{problem_id}/{post_id}", response_model=Dict[str, Any])
def get_post_by_id(
    problem_id: int,
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
    post_id: uuid.UUID,
):
    """
    IDによる投稿の取得
    """

    return crud_post.get_by_id(db_session=db, problem_id=problem_id, post_id=post_id)


@router.put("/{problem_id}/{post_id}", response_model=Dict[str, Any])
def update_post(
    problem_id: int,
    post_id: uuid.UUID,
    *,
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
    update_data: PostUpdate
):
    """
    投稿を更新
    """

    return crud_post.update(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=mock_id,
        update_data=update_data,
    )


@router.delete("/{problem_id}/{post_id}")
def delete_post(
    problem_id: int,
    post_id: uuid.UUID,
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentAdminUser,
):
    """
    投稿を削除
    """

    return crud_post.delete(
        db_session=db, problem_id=problem_id, post_id=post_id, user_id=mock_id
    )


@router.patch("/{problem_id}/{post_id}/solve", response_model=Dict[str, Any])
def mark_as_solved(
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentAdminUser
):
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


@router.patch("/{problem_id}/{post_id}/unsolve", response_model=Dict[str, Any])
def mark_as_unsolved(
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentAdminUser
):
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
