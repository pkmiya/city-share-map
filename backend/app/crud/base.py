from typing import Generic, List, Optional, Type, TypeVar

from app.models.base import Base
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get_dynamic_table(self, db_session: Session, problem_id: int):
        """
        動的テーブルを取得
        """
        table_name = f"post_{problem_id}"
        Base = automap_base()
        Base.prepare(db_session.get_bind(), reflect=True)

        if table_name in Base.classes:
            return Base.classes[table_name]
        else:
            raise HTTPException(
                status_code=404, detail=f"テーブル '{table_name}' が見つかりません"
            )

    def get(self, db_session: Session, id: int) -> Optional[ModelType]:
        return db_session.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db_session: Session, *, skip=0, limit=100) -> List[ModelType]:
        return db_session.query(self.model).offset(skip).limit(limit).all()

    def create(self, db_session: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def update(
        self, db_session: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def delete(self, db_session: Session, *, id: int) -> ModelType:
        obj = db_session.query(self.model).get(id)
        db_session.delete(obj)
        db_session.commit()
        return obj
