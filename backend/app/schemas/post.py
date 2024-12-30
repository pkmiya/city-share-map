from datetime import datetime
from decimal import Decimal
from typing import Dict, Optional, Union
from uuid import UUID

from app.schemas.base_schema import BaseSchema


class Coordinate(BaseSchema):
    latitude: Decimal
    longitude: Decimal


class PostBase(BaseSchema):
    latitude: Decimal
    longitude: Decimal
    is_solved: bool = False
    items: Dict[str, Union[int, str, bool, datetime]]

    class Config:
        orm_mode = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseSchema):
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    items: Optional[Dict[str, Union[int, str, bool, datetime]]] = None


class ProblemForPost(BaseSchema):
    id: int
    name: str
    is_open: bool


class UserForPost(BaseSchema):
    id: UUID
    name: str


class PostResponseBase(BaseSchema):
    id: UUID
    is_solved: bool
    problem: ProblemForPost
    coodinate: Coordinate
    user: Optional[UserForPost]
    created_at: datetime
    updated_at: Optional[datetime]
    updated_by: Optional[Union[int, UUID]]

    class Config:
        orm_mode = True


class PostResponse(PostResponseBase):
    items: Dict[str, Union[int, str, bool, datetime]]

    class Config:
        orm_mode = True


class ProblemMapResponse(BaseSchema):
    name: str
    value: str


class PostMapResponse(PostResponseBase):
    photo_field: Optional[ProblemMapResponse]
    descriptions: Optional[ProblemMapResponse]

    class Config:
        orm_mode = True
