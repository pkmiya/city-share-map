import uuid
from datetime import datetime, timedelta
from typing import List

from app.api.deps import CurrentStaffUser, SessionDep
from app.core import security
from app.core.config import settings
from app.crud.citizen_user import crud_citizen_user
from app.models.user import CitizenUser as DBCitizenUser
from app.schemas.token import Token
from app.schemas.user import (
    CitizenUser,
    CitizenUserCreate,
    CitizenUserRead,
    CitizenUserUpdate,
)
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/access-token", response_model=Token)
async def login_line_user(session: SessionDep, id_token: str) -> Token:
    """
    Line login, get an access token for future requests
    """
    line_info = await security.get_line_info(id_token)
    line_id = line_info["line_id"]
    name = line_info["name"]

    user = crud_citizen_user.authenticate(db_session=session, line_id=line_id)
    if not user:
        obj_in = CitizenUserCreate(line_id=line_id, name=name, is_active=True)
        user = crud_citizen_user.create(db_session=session, obj_in=obj_in)
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="ログイン権限がありません")

    user = crud_citizen_user.update_last_login(
        session,
        db_obj=user,
        obj_in={"last_login": datetime.now()},
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires, user_type="citizen"
        )
    )


@router.get("/", response_model=List[CitizenUserRead])
def read_citizen_users(
    session: SessionDep,
    current_user: CurrentStaffUser,
    skip: int = 0,
    limit: int = 100,
) -> List[CitizenUserRead]:
    """
    Retrieve users.
    """
    users = crud_citizen_user.get_users(session, skip=skip, limit=limit)
    return users


@router.put("/{user_id}", response_model=CitizenUser)
def update_citizen_user(
    session: SessionDep,
    current_user: CurrentStaffUser,
    user_id: uuid.UUID,
    is_active: bool,
) -> DBCitizenUser:
    """
    Update a user.
    """
    user = crud_citizen_user.get(session, user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="そのユーザーは存在しません",
        )
    obj_in = CitizenUserUpdate(is_active=is_active)
    user = crud_citizen_user.update(session, db_obj=user, obj_in=obj_in)
    return user
