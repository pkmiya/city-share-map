from app.schemas.base_schemas import BaseSchema


class LoginRequest(BaseSchema):
    username: str
    password: str
