from typing import Optional

from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid

# Shared properties
class UserBase(BaseModel):
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
class UserUpdate(BaseModel):
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

class UserUpdateMe(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


class CitizenUserBase(BaseModel):
    id: uuid.UUID = None
    name: Optional[str] = None
    line_id: Optional[str] = None
    is_active: Optional[bool] = True
    class Config:
        arbitrary_types_allowed = True

class CitizenUser(CitizenUserBase):
    pass

class AllUser(User, CitizenUser):
    id: Optional[int|str] = None

class CitizenUserCreate(CitizenUserBase):
    pass

class CitizenUserUpdate(BaseModel):
    is_active: Optional[bool] = True

class CitizenUserRead(CitizenUserBase):
    last_login: datetime
    post_count: int 
