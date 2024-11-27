from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from app.crud.user import crud_user
from app.api.deps import CurrentCitizenUser, CurrentAdminSuperuser, CurrentAdminUser, SessionDep
from app.core.config import settings
from app.models.user import User as DBUser
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[User])
def read_admin_users(
    session : SessionDep,
    current_user: CurrentAdminUser,
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve users.
    """
    users = crud_user.get_multi(session, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_admin_user(
    *,
    session : SessionDep,
    user_in: UserCreate,
    current_user: CurrentAdminSuperuser
):
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
    session : SessionDep,
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: CurrentAdminUser,
):
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    user = crud_user.update(session, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=User)
def read_user_me(
    session : SessionDep,
    current_user: CurrentAdminUser,
):
    """
    Get current user.
    """
    return current_user


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    session : SessionDep,
    user_id: int,
    current_user: CurrentAdminUser,
):
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
    session : SessionDep,
    user_id: int,
    user_in: UserUpdate,
    current_user: CurrentAdminSuperuser,
):
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
    session : SessionDep,
    user_id: int,
    current_user: CurrentAdminSuperuser,
):
    """
    Delete a user.
    """
    user = crud_user.get(session, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="対象のユーザーが存在しません",
        )
    users = crud_user.get_multi(session)
    if len(users) == 1:
        raise HTTPException(
            status_code=400,
            detail="最低1人の管理者が必要です",
        )
    user = crud_user.delete(session, id=user_id)
    return user