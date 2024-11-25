from pydantic import BaseModel
from pydantic.fields import Field

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserToken(Token):
    id_token: str

class TokenPayload(BaseModel):
    user_id: int = None
    user_type: str = None

class NewPassword(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)