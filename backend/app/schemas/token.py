from typing import Union
from uuid import UUID

from app.schemas.base_schemas import BaseSchema
from pydantic.fields import Field


class Token(BaseSchema):
    access_token: str
    token_type: str = "bearer"


class UserToken(Token):
    id_token: str


class TokenPayload(BaseSchema):
    user_id: Union[int, UUID]
    user_type: str


class NewPassword(BaseSchema):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
