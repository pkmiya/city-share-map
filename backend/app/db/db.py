from sqlmodel import create_engine
from sqlalchemy import inspect
from app.crud.user import crud_user
from app.core.config import settings
from app.schemas.user import UserCreate
from app.models.problems import Type
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user import CitizenUser

# make sure all SQL Alchemy models are imported before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28
from app.models.base import Base  # noqa: F401
from sqlalchemy import Text, Integer, Boolean, DateTime


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

type_mapping = {
    1: Text,
    2: Text,
    3: DateTime,
    4: Integer,
    5: Boolean,
    # 必要に応じて他の型も追加
}

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
                full_name="Admin",
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                department="Admin",
                is_superuser=True,
            )
            user = crud_user.create(db_session, obj_in=user_in)  # noqa: F841
        
        citizen_user_data = [
            {"id": uuid.UUID("00000000-0000-0000-0000-000000000000"), "name": "テストユーザ1", "line_id": "test_user_1", "is_active": True},
            {"id": uuid.UUID("00000000-1111-0000-0000-000000000000"), "name": "テストユーザ2", "line_id": "test_user_2", "is_active": False},
            {"id": uuid.UUID("00000000-2222-0000-0000-000000000000"), "name": "テストユーザ3", "line_id": "test_user_3", "is_active": True},
        ]
        for data in citizen_user_data:
            citizen_user = CitizenUser(
                id=data["id"],
                name=data["name"],
                line_id=data["line_id"],
                is_active=data["is_active"],
                last_login=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
            db_session.add(citizen_user)

        master_data = [
                {"id": 1, "name": "テキスト"},
                {"id": 2, "name": "写真"},
                {"id": 3, "name": "日時"},
                {"id": 4, "name": "数値"},
                {"id": 5, "name": "真偽値"},
            ]
        for data in master_data:
            type_entry = Type(id=data["id"], name=data["name"])
            db_session.add(type_entry)

        # コミットしてデータを保存
        db_session.commit()
