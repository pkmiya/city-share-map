from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
import jwt
from fastapi import HTTPException
from passlib.context import CryptContext

from app.core.config import settings
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def create_access_token(
    subject: str | Any, user_type: str, expires_delta: timedelta
) -> str:
    """
    アクセストークンを発行する
    （自治体User,市民Userどちらも使用）
    """
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "user_id": str(subject), "user_type": user_type}
    encoded_jwt: str = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_id_token(user: User, expires_delta: timedelta) -> str:
    """
    IDトークンを発行する
    （自治体Userのみ使用,市民UserのIdTokenはLINEからfrontでもらう）
    """
    expire = datetime.now(timezone.utc) + expires_delta
    claims = {
        "sub": str(user.id),  # ユーザーの一意識別子
        "email": user.email,
        "name": user.full_name,
        "department": user.department,
        "iat": datetime.now(timezone.utc),  # トークン発行時刻
        "exp": expire,  # 有効期限
    }
    if user.is_superuser:
        claims["roles"] = ["admin"]

    id_token: str = jwt.encode(claims, settings.SECRET_KEY, algorithm=ALGORITHM)

    return id_token


def verify_password(plain_password: str, hashed_password: str) -> bool:
    response: bool = pwd_context.verify(plain_password, hashed_password)
    return response


def get_password_hash(password: str) -> str:
    response: str = pwd_context.hash(password)
    return response


async def get_line_info(id_token: str) -> dict[str, str]:
    verify_url = "https://api.line.me/oauth2/v2.1/verify"
    params = {"id_token": id_token, "client_id": settings.LIFF_CHANNEL_ID}

    async with httpx.AsyncClient() as client:
        response = await client.post(verify_url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400, detail=f"LINE認証に失敗しました:{response.text}"
        )

    user_info = response.json()
    line_id = user_info.get("sub")
    name = user_info.get("name")

    if not line_id:
        raise HTTPException(status_code=404, detail="LINE IDが取得できませんでした")

    return {"line_id": line_id, "name": name}
