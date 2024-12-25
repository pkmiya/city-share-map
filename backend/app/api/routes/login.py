from datetime import timedelta

from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.crud.user import crud_user
from app.schemas.login import LoginRequest
from app.schemas.token import UserToken
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/")
def login(session: SessionDep, form_data: LoginRequest) -> UserToken:
    """
    Token login, get an access token for future requests
    """
    user = crud_user.authenticate(
        db_session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=404, detail="メールアドレスまたはパスワードが正しくありません"
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="ログイン権限がありません")

    user_type = "admin" if user.is_superuser else "staff"

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    id_token_expires = timedelta(minutes=settings.ID_TOKEN_EXPIRE_MINUTES)

    return UserToken(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires, user_type=user_type
        ),
        id_token=security.create_id_token(user, expires_delta=id_token_expires),
    )


@router.post("/swagger/")
def swagger_login(session: SessionDep, form_data: LoginRequest) -> UserToken:
    """
    Token login, get an access token for future requests
    """
    user = crud_user.authenticate(
        db_session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=404, detail="メールアドレスまたはパスワードが正しくありません"
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="ログイン権限がありません")

    user_type = "admin" if user.is_superuser else "staff"

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    id_token_expires = timedelta(minutes=settings.ID_TOKEN_EXPIRE_MINUTES)

    return UserToken(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires, user_type=user_type
        ),
        id_token=security.create_id_token(user, expires_delta=id_token_expires),
    )
