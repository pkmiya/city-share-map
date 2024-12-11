from datetime import timedelta

from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.crud.user import crud_user
from app.schemas.login import LoginRequest
from app.schemas.msg import Msg
from app.schemas.token import NewPassword, UserToken
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)
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


@router.post("/password-recovery/{email}")
def recover_password(email: str, session: SessionDep) -> Msg:
    """
    Password Recovery
    """
    user = crud_user.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Msg(message="Password recovery email sent")


@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Msg:
    """
    Reset password
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud_user.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    user.hashed_password = hashed_password
    session.add(user)
    session.commit()
    return Msg(message="Password updated successfully")
