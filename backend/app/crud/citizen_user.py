from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import CitizenUser
from app.schemas.user import CitizenUserCreate, CitizenUserUpdate
from app.core.security import verify_password, get_password_hash
from app.crud.base import CRUDBase


class CRUDCitizenUser(CRUDBase[CitizenUser, CitizenUserCreate, CitizenUserUpdate]):
    def get_by_line_id(self, db_session: Session, *, line_id: str) -> Optional[CitizenUser]:
        return db_session.query(CitizenUser).filter(CitizenUser.line_id == line_id).first()

    def create(self, db_session: Session, *, obj_in: CitizenUserCreate) -> CitizenUser:
        db_obj = CitizenUser(
            line_id=obj_in.line_id,
            name=obj_in.name,
            is_active=obj_in.is_active
        )
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def update(self, db_session: Session, *, db_obj: CitizenUser, obj_in: CitizenUserUpdate) -> CitizenUser:
        pass

    def authenticate(
        self, db_session: Session, *, line_id: str
    ) -> Optional[CitizenUser]:
        user = self.get_by_line_id(db_session, line_id=line_id)
        if not user:
            return None
        return user

    def is_active(self, user: CitizenUser) -> bool:
        return user.is_active


crud_citizen_user = CRUDCitizenUser(CitizenUser)