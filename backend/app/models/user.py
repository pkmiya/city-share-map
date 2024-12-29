from datetime import datetime
from uuid import UUID, uuid4

from app.models.base import Base, CommonColumns
from sqlalchemy import UUID as DBUUID
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column


class User(Base, CommonColumns):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    full_name: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    department: Mapped[str] = mapped_column(String, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


# CitizenUsers Table
class CitizenUser(Base, CommonColumns):
    __tablename__ = "citizen_users"

    id: Mapped[UUID] = mapped_column(
        DBUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    line_id: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login: Mapped[datetime] = mapped_column(DateTime)

    # posts = relationship("PostBase", back_populates="citizen_user")
    # post_likes = relationship("PostLikeBase", back_populates="user")


# PostLikes Table
# class PostLikeBase(Base, CommonColumns):
#     __tablename__ = "post_likes"

#     id: Mapped[UUID] = mapped_column(
#         DBUUID(as_uuid=True), primary_key=True, default=uuid4
#     )
#     post_id: Mapped[UUID] = mapped_column(
#         DBUUID(as_uuid=True), ForeignKey("posts.id"), nullable=False
#     )
#     user_id: Mapped[UUID] = mapped_column(
#         DBUUID(as_uuid=True), ForeignKey("citizen_users.id"), nullable=False
#     )

#     post = relationship("PostBase", back_populates="post_likes")
#     user = relationship("User", back_populates="post_likes")
