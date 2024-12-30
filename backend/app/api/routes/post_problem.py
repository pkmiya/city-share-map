import uuid
from typing import Any, Dict, List, Optional

import boto3
from app.api.deps import CurrentAllUser, CurrentStaffUser, SessionDep
from app.core.config import settings
from app.crud.post import crud_post
from app.schemas.problem import PostCreate, PostUpdate
from fastapi import APIRouter, File, UploadFile

router = APIRouter()
mock_id = uuid.UUID("00000000-0000-0000-0000-000000000000")  # モック用のID


@router.get("/", response_model=List[Dict[str, Any]])
def get_posts(
    db: SessionDep,
    current_user: CurrentAllUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
    problem_id: Optional[int] = None,
    user_id: Optional[uuid.UUID] = None,
) -> List[Dict[str, Any]]:
    """
    投稿の一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters: Dict[str, Any] = {}
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

    return crud_post.get_post(
        db_session=db, skip=skip, limit=limit, filters=filters, user_type=user_type
    )


@router.post("/file_upload", response_model=Dict[str, str])
async def file_upload(file: UploadFile = File(None)) -> Dict[str, str]:
    s3_bucket = settings.AWS_S3_BUCKET_NAME
    region_name = settings.AWS_REGION
    print("🫶")
    print(s3_bucket, region_name)

    s3 = boto3.client(
        "s3",
        region_name=region_name,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )

    s3.put_object(Body=file.file, Bucket=s3_bucket, Key=f"{file.filename}")

    # S3にアップロードしたオブジェクトのパス
    file_url = "https://%s.s3-%s.amazonaws.com/%s" % (
        s3_bucket,
        region_name,
        file.filename,
    )

    response = {"file_url": file_url}

    return response


@router.get("/me", response_model=List[Dict[str, Any]])
def get_posts_me(
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentStaffUser,
    skip: int = 0,
    limit: int = 100,
    is_solved: Optional[bool] = None,
    is_open: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    """
    Userが投稿したレポートの一覧を取得
    フィルタリングとページネーションをサポート
    """
    filters: Dict[str, Any] = {}
    if is_solved is not None:
        filters["is_solved"] = is_solved

    if is_open is not None:
        filters["is_open"] = is_open

    # filters["user_id"] = current_user.id
    filters["user_id"] = uuid.UUID("00000000-0000-0000-0000-000000000000")

    return crud_post.get_post(
        db_session=db, skip=skip, limit=limit, filters=filters, user_type="staff"
    )


@router.post("/{problem_id}", response_model=Dict[str, Any])
def create_post(
    *,
    db: SessionDep,
    problem_id: int,
    # current_user: CurrentCitizenUser,
    current_user: CurrentStaffUser,
    post_in: PostCreate,
) -> Dict[str, Any]:
    """
    新しい投稿を作成
    """
    return crud_post.create_post(
        db_session=db, problem_id=problem_id, user_id=mock_id, post_in=post_in
    )


@router.get("/{problem_id}/{post_id}", response_model=Dict[str, Any])
def get_post_by_id(
    problem_id: int,
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentStaffUser,
    post_id: uuid.UUID,
) -> Dict[str, Any]:
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
    current_user: CurrentStaffUser,
    update_data: PostUpdate,
) -> Dict[str, Any]:
    """
    投稿を更新
    """

    return crud_post.update_post(
        db_session=db,
        problem_id=problem_id,
        post_id=post_id,
        user_id=mock_id,
        update_data=update_data,
    )


@router.delete("/{problem_id}/{post_id}", response_model=Dict[str, Any])
def delete_post(
    problem_id: int,
    post_id: uuid.UUID,
    db: SessionDep,
    # current_user: CurrentCitizenUser,
    current_user: CurrentStaffUser,
) -> Dict[str, Any]:
    """
    投稿を削除
    """

    return crud_post.delete_post(
        db_session=db, problem_id=problem_id, post_id=post_id, user_id=mock_id
    )


@router.patch("/{problem_id}/{post_id}/solve", response_model=Dict[str, Any])
def mark_as_solved(
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentStaffUser
) -> Dict[str, Any]:
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
    problem_id: int, post_id: uuid.UUID, db: SessionDep, current_user: CurrentStaffUser
) -> Dict[str, Any]:
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
