from typing import List
from fastapi import APIRouter, HTTPException
from app.core.config import settings
from datetime import timedelta
from app.crud.citizen_user import crud_citizen_user
from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.schemas.token import Token


router = APIRouter()

@router.post("/access-token")
def login_line_user(
    session: SessionDep, id_token: str
) -> Token:
    """
    Line login, get an access token for future requests
    """
    line_info = security.get_line_info(id_token)
    line_id = line_info["line_id"]
    name = line_info["name"]

    user = crud_citizen_user.authenticate(
        db_session=session, line_id=line_id
    )
    if not user:
        obj_in = {"line_id": line_id, "name": name, "is_active": True}
        user = crud_citizen_user.create(db_session=session, obj_in=obj_in)
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires, user_type="citizen"
        )
    )

