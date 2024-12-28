from collections.abc import Generator
from typing import Annotated, Union

import jwt
from app.core import security
from app.core.config import settings
from app.crud.citizen_user import crud_citizen_user
from app.crud.user import crud_user
from app.db.db import engine
from app.models.user import CitizenUser, User
from app.schemas.token import TokenPayload
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/swagger/")


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return TokenPayload(**payload)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンの有効期限が切れています",
        )
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="デコードに失敗しました",
        )


def get_user_by_token(
    session: Session, token_data: TokenPayload
) -> Union[CitizenUser, User]:
    user: Union[CitizenUser, User, None] = None

    if token_data.user_type == "citizen":
        user = crud_citizen_user.get(session, token_data.user_id)
    else:
        user = crud_user.get(session, token_data.user_id)

    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="ユーザーが無効です")
    return user


def get_current_all_user(
    session: SessionDep, token: TokenDep
) -> Union[CitizenUser, User]:
    token_data = decode_token(token)
    return get_user_by_token(session, token_data)


def get_current_admin_user(
    session: SessionDep, token: TokenDep
) -> Union[CitizenUser, User]:
    token_data = decode_token(token)
    if token_data.user_type == "citizen":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )
    return get_user_by_token(session, token_data)


def get_current_citizen_user(
    session: SessionDep, token: TokenDep
) -> Union[CitizenUser, User]:
    token_data = decode_token(token)
    if token_data.user_type != "citizen":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )
    return get_user_by_token(session, token_data)


def get_current_admin_superuser(
    session: SessionDep, token: TokenDep
) -> Union[CitizenUser, User]:
    token_data = decode_token(token)
    if token_data.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="権限がありません",
        )
    return get_user_by_token(session, token_data)


CurrentAllUser = Annotated[Union[CitizenUser, User], Depends(get_current_all_user)]
CurrentCitizenUser = Annotated[CitizenUser, Depends(get_current_citizen_user)]
CurrentStaffUser = Annotated[User, Depends(get_current_admin_user)]
CurrentAdminUser = Annotated[User, Depends(get_current_admin_superuser)]
