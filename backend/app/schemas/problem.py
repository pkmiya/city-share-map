from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Dict, Any

# ProblemItemの作成時のスキーマ
class ProblemItemBase(BaseModel):
    name: str  # 項目名
    type_id: int = 1 # 項目のデータ型のID

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
class ProblemBase(BaseModel):
    name: str  # 課題の名前
    is_open: bool = False  # 募集中かどうかのフラグ

class ProblemCreate(ProblemBase):
    items: List[ProblemItemCreate]  # 問題の項目リスト

class ProblemUpdate(ProblemBase):
    name: Optional[str] = None  # オプションで課題名の変更
    is_open: Optional[bool] = None  # オプションで現在募集中かの変更

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

class ProblemInDB(ProblemInDBBase):
    pass

class PostBase(BaseModel):
    latitude: Decimal
    longitude: Decimal
    is_solved: bool = False
    items: Dict[str, Any]

    class Config:
        orm_mode = True

class PostCreate(PostBase):
    pass
class PostUpdate(BaseModel):
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    items: Optional[Dict[str, Any]]