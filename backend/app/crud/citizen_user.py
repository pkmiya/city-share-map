from datetime import datetime
from typing import Dict, List, Optional

from app.crud.base import CRUDBase
from app.models.problems import Problem
from app.models.user import CitizenUser
from app.schemas.user import CitizenUserCreate, CitizenUserRead, CitizenUserUpdate
from sqlalchemy import func
from sqlalchemy.orm import Session


class CRUDCitizenUser(CRUDBase[CitizenUser, CitizenUserCreate, CitizenUserUpdate]):
    def get_by_line_id(
        self, db_session: Session, *, line_id: str
    ) -> Optional[CitizenUser]:
        user = (
            db_session.query(CitizenUser).filter(CitizenUser.line_id == line_id).first()
        )
        return user

    def get_users(
        self, db_session: Session, *, skip: int = 0, limit: int = 100
    ) -> List[CitizenUserRead]:
        user_post_counts = {}
        res = []

        problems = db_session.query(Problem).all()
        for problem in problems:
            dynamic_table = self.get_dynamic_table(db_session, problem.id)

            subquery = (
                db_session.query(
                    dynamic_table.user_id,
                    func.count(dynamic_table.id).label("post_count"),
                )
                .group_by(dynamic_table.user_id)
                .subquery()
            )

            for user_id, post_count in db_session.query(
                subquery.c.user_id, subquery.c.post_count
            ):
                if user_id not in user_post_counts:
                    user_post_counts[user_id] = 0
                user_post_counts[user_id] += post_count

        users = db_session.query(CitizenUser).offset(skip).limit(limit).all()
        for user in users:
            result = CitizenUserRead(
                id=user.id,
                line_id=user.line_id,
                name=user.name,
                is_active=user.is_active,
                post_count=user_post_counts.get(user.id, 0),
                last_login=user.last_login,
            )
            res.append(result)

        return res

    def update_last_login(
        self, db_session: Session, *, db_obj: CitizenUser, obj_in: Dict[str, datetime]
    ) -> CitizenUser:
        db_obj.last_login = obj_in["last_login"]
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db_session: Session, *, line_id: str
    ) -> Optional[CitizenUser]:
        user = self.get_by_line_id(db_session, line_id=line_id)
        if not user:
            return None
        return user

    def is_active(self, user: CitizenUser) -> bool:
        response: bool = user.is_active
        return response


crud_citizen_user = CRUDCitizenUser(CitizenUser)
