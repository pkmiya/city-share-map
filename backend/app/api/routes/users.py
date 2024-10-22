from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from app.crud.user import crud_user
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.models.user import User as DBUser
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[User])
def read_users(
    session : SessionDep,
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_superuser)
):
    """
    Retrieve users.
    """
    users = crud_user.get_multi(session, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_user(
    *,
    session : SessionDep,
    user_in: UserCreate,
    current_user: DBUser = Depends(get_current_active_superuser)
):
    """
    Create new user.
    """
    user = crud_user.get_by_email(session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud_user.create(session, obj_in=user_in)
    # if settings.EMAILS_ENABLED and user_in.email:
    #     send_new_account_email(
    #         email_to=user_in.email, username=user_in.email, password=user_in.password
    #     )
    return user


@router.put("/me", response_model=User)
def update_user_me(
    *,
    session : SessionDep,
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: CurrentUser,
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
    current_user: CurrentUser,
):
    """
    Get current user.
    """
    return current_user


# @router.post("/open", response_model=User)
# def create_user_open(
#     *,
#     session : SessionDep,
#     password: str = Body(...),
#     email: EmailStr = Body(...),
#     full_name: str = Body(None),
# ):
#     """
#     Create new user without the need to be logged in.
#     """
#     if not settings.USERS_OPEN_REGISTRATION:
#         raise HTTPException(
#             status_code=403,
#             detail="Open user registration is forbidden on this server",
#         )
#     user = crud_user.get_by_email(session, email=email)
#     if user:
#         raise HTTPException(
#             status_code=400,
#             detail="The user with this username already exists in the system",
#         )
#     user_in = UserCreate(password=password, email=email, full_name=full_name)
#     user = crud_user.create(session, obj_in=user_in)
#     return user


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    session : SessionDep,
    user_id: int,
    current_user: DBUser = Depends(get_current_active_superuser),
):
    """
    Get a specific user by id.
    """
    user = crud_user.get(session, id=user_id)
    if user == current_user:
        return user
    if not crud_user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    session : SessionDep,
    user_id: int,
    user_in: UserUpdate,
    current_user: DBUser = Depends(get_current_active_superuser),
):
    """
    Update a user.
    """
    user = crud_user.get(session, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = crud_user.update(session, db_obj=user, obj_in=user_in)
    return user