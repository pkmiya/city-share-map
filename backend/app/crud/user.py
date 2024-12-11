from typing import Optional

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, UserUpdateMe
from sqlalchemy.orm import Session


class CRUDUser(CRUDBase[User, UserCreate, UserInDB]):
    def get_by_email(self, db_session: Session, *, email: str) -> Optional[User]:
        return db_session.query(User).filter(User.email == email).first()

    def create(self, db_session: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_superuser=obj_in.is_superuser,
            department=obj_in.department,
        )
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def update_me(
        self, db_session: Session, *, db_obj: User, obj_in: UserUpdateMe
    ) -> User:

        update_data = obj_in.dict(exclude_unset=True)
        if obj_in.password:
            hashed_password = get_password_hash(obj_in.password)
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        else:
            update_data["hashed_password"] = db_obj.hashed_password

        use_obj_in = UserInDB.parse_obj(update_data)

        return super().update(db_session, db_obj=db_obj, obj_in=use_obj_in)

    def authenticate(
        self, db_session: Session, *, email: str, password: str
    ) -> Optional[User]:
        user = self.get_by_email(db_session, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


crud_user = CRUDUser(User)
