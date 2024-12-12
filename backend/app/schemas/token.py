from typing import Union
from uuid import UUID

from pydantic import BaseModel
from pydantic.fields import Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserToken(Token):
    id_token: str


class TokenPayload(BaseModel):
    user_id: Union[int, UUID]
    user_type: str


class NewPassword(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
