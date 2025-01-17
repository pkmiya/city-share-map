from typing import List, Optional

from app.api.deps import CurrentAdminUser, CurrentStaffUser, SessionDep
from app.crud.user import crud_user
from app.models.user import User as DBUser
from app.schemas.user import User, UserCreate, UserUpdate, UserUpdateMe
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/", response_model=List[User])
def read_admin_users(
    session: SessionDep,
    current_user: CurrentStaffUser,
    skip: int = 0,
    limit: int = 100,
) -> List[DBUser]:
    """
    Retrieve users.
    """
    users = crud_user.get_multi(session, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_admin_user(
    *, session: SessionDep, user_in: UserCreate, current_user: CurrentAdminUser
) -> DBUser:
    """
    Create new user.
    """
    user = crud_user.get_by_email(session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="そのメールアドレスは既に登録されています",
        )
    user = crud_user.create(session, obj_in=user_in)
    return user


@router.put("/me", response_model=User)
def update_user_me(
    *,
    session: SessionDep,
    current_user: CurrentStaffUser,
    user_in: UserUpdateMe,
) -> DBUser:
    """
    Update own user.
    """
    if user_in.email:
        existing_user = crud_user.get_by_email(session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400, detail="そのメールアドレスは既に登録されています"
            )
    user = crud_user.update_me(session, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=User)
def read_user_me(
    session: SessionDep,
    current_user: CurrentStaffUser,
) -> DBUser:
    """
    Get current user.
    """
    return current_user


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    session: SessionDep,
    user_id: int,
    current_user: CurrentStaffUser,
) -> DBUser:
    """
    Get a specific user by id.
    """
    user = crud_user.get(session, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="対象のユーザーが存在しません",
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    session: SessionDep,
    user_id: int,
    user_in: UserUpdate,
    current_user: CurrentAdminUser,
) -> DBUser:
    """
    Update a user.
    """
    user = crud_user.get(session, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="対象のユーザーが存在しません",
        )
    if user.is_superuser:
        raise HTTPException(
            status_code=400,
            detail="更新する権限がありません",
        )
    user = crud_user.update(session, db_obj=user, obj_in=user_in)
    return user


@router.delete("/{user_id}", response_model=User)
def delete_user(
    *,
    session: SessionDep,
    user_id: int,
    current_user: CurrentAdminUser,
) -> Optional[DBUser]:
    """
    Delete a user.
    """
    user = crud_user.get(session, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="対象のユーザーが存在しません",
        )
    if user.is_superuser:
        raise HTTPException(
            status_code=400,
            detail="削除する権限がありません",
        )
    user = crud_user.delete(session, id=user_id)
    return user
