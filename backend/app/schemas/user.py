from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.base_schemas import BaseSchema
from pydantic import EmailStr


# Shared properties
class UserBase(BaseSchema):
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    full_name: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: str
    department: str


# Properties to receive via API on update
class UserUpdate(BaseSchema):
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False


class UserUpdateMe(BaseSchema):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: int


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


class CitizenUserBase(BaseSchema):

    name: Optional[str] = None
    line_id: Optional[str] = None
    is_active: bool = True
    last_login: Optional[datetime] = None


class CitizenUser(CitizenUserBase):
    id: UUID


class CitizenUserCreate(CitizenUserBase):
    pass


class CitizenUserUpdate(BaseSchema):
    is_active: Optional[bool] = True


class CitizenUserRead(CitizenUser):
    last_login: datetime
    post_count: int
