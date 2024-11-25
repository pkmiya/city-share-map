from collections.abc import Generator
from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session
from app.core import security
from app.core.config import settings
from app.db.db import engine
from app.crud.user import crud_user
from app.crud.citizen_user import crud_citizen_user
from app.schemas.token import TokenPayload
from app.schemas.user import AllUser, User, CitizenUser

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="validation error",
        )


def get_user_by_token(session: Session, token_data: TokenPayload) -> User:
    if token_data.user_type == "citizen":
        user = crud_citizen_user.get(session, token_data.user_id)
    else:
        user = crud_user.get(session, token_data.user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


def get_current_all_user(session: SessionDep, token: TokenDep) -> AllUser:
    token_data = decode_token(token)
    return get_user_by_token(session, token_data)


def get_current_admin_user(session: SessionDep, token: TokenDep) -> User:
    token_data = decode_token(token)
    if token_data.user_type == "citizen":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )
    return get_user_by_token(session, token_data)


def get_current_citizen_user(session: SessionDep, token: TokenDep) -> CitizenUser:
    token_data = decode_token(token)
    if token_data.user_type != "citizen":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )
    return get_user_by_token(session, token_data)


def get_current_admin_superuser(session: SessionDep, token: TokenDep) -> User:
    token_data = decode_token(token)
    if token_data.user_type != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )

SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
CurrentAllUser = Annotated[User, Depends(get_current_all_user)]
CurrentAdminUser = Annotated[User, Depends(get_current_admin_user)]
CurrentCitizenUser = Annotated[User, Depends(get_current_citizen_user)]
CurrentAdminSuperuser = Annotated[User, Depends(get_current_admin_superuser)]

