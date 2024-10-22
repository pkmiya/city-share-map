from sqlmodel import create_engine
from sqlalchemy import inspect
from app.crud.user import crud_user
from app.core.config import settings
from app.schemas.user import UserCreate
from app.models.problems import Type
import uuid

from sqlalchemy.orm import Session
from app.models.user import CitizenUser
from app.schemas.user import CitizenUserCreate

# make sure all SQL Alchemy models are imported before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28
from app.db.base import Base  # noqa: F401


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db(db_session):
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line

    inspector = inspect(engine)

    if not inspector.has_table("types"):  # "your_table_name"を実際のテーブル名に変更
        # テーブルが存在しない場合、create_all()を実行
        Base.metadata.create_all(bind=engine)

        user = crud_user.get_by_email(db_session, email=settings.FIRST_SUPERUSER)
        if not user:
            user_in = UserCreate(
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                is_superuser=True,
            )
            user = crud_user.create(db_session, obj_in=user_in)  # noqa: F841
        master_data = [
                {"id": 1, "name": "文字列", "type": "TEXT"},
                {"id": 2, "name": "日付", "type": "DATETIME"},
                {"id": 3, "name": "画像", "type": "VARCHAR(255)"},
            ]

        for data in master_data:
            type_entry = Type(id=data["id"], name=data["name"], type=data["type"])
            db_session.add(type_entry)

        # コミットしてデータを保存
        db_session.commit()
