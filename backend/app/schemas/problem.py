from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from app.schemas.base_schema import BaseSchema


# ProblemItemの作成時のスキーマ
class ProblemItemBase(BaseSchema):
    name: str  # 項目名
    type_id: int = 1  # 項目のデータ型のID
    required: bool = False  # 必須かどうかのフラグ

    class Config:
        orm_mode = True


class ProblemItemCreate(ProblemItemBase):
    pass


class ProblemItemUpdate(ProblemItemBase):
    pass


class ProblemItemInDBBase(ProblemItemBase):
    id: int
    problem_id: int

    class Config:
        orm_mode = True


# Problemの作成時のスキーマ
class ProblemBase(BaseSchema):
    name: str  # 課題の名前
    is_open: bool = False  # 募集中かどうかのフラグ
    description: Optional[str] = None  # 課題の説明


class ProblemCreate(ProblemBase):
    items: List[ProblemItemCreate]  # 問題の項目リスト


class ProblemUpdate(BaseSchema):
    name: Optional[str]
    is_open: Optional[bool]
    description: Optional[str]


class ProblemInDBBase(ProblemBase):
    id: int

    class Config:
        orm_mode = True


# 完成したProblemの出力スキーマ
class Problem(ProblemInDBBase):
    pass


class ProblemRead(ProblemInDBBase):
    post_count: Optional[int] = 0
    created_at: Optional[datetime]


class ProblemReadByID(ProblemRead):
    items: List[ProblemItemBase]


class ProblemInDB(ProblemInDBBase):
    pass


class Type(BaseSchema):
    id: int
    name: str


class Coordinate(BaseSchema):
    latitude: Decimal
    longitude: Decimal


class PostBase(BaseSchema):
    latitude: Decimal
    longitude: Decimal
    is_solved: bool = False
    items: Dict[str, Any]

    class Config:
        orm_mode = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseSchema):
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    items: Optional[Dict[str, Any]] = None


class ProblemForPost(BaseSchema):
    id: int
    name: str
    is_open: bool


class UserForPost(BaseSchema):
    id: UUID
    username: str


class PostResponseBase(BaseSchema):
    id: UUID
    is_solved: bool
    problem: ProblemForPost
    coodinate: Coordinate
    user: Optional[UserForPost]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class PostResponse(PostResponseBase):
    items: Dict[str, Optional[Union[int, str, bool, datetime]]]

    class Config:
        orm_mode = True
