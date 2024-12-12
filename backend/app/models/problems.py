from decimal import Decimal
from uuid import UUID

from app.models.base import Base, CommonColumns
from sqlalchemy import DECIMAL
from sqlalchemy import UUID as DBUUID
from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


# Problems Table
class Problem(Base, CommonColumns):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    description: Mapped[str] = mapped_column(String)

    problem_items = relationship("ProblemItem", back_populates="problem")
    posts = relationship("PostBase", back_populates="problem")


# ProblemItems Table
class ProblemItem(Base, CommonColumns):
    __tablename__ = "problem_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    problem_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("problems.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    type_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("types.id"), nullable=False
    )
    required: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    problem = relationship("Problem", back_populates="problem_items")
    type = relationship("Type")


# Types Table
class Type(Base):
    __tablename__ = "types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)


# Posts_<problem_id> Table
class PostBase(Base, CommonColumns):
    __tablename__ = "posts"

    id: Mapped[UUID] = mapped_column(DBUUID(as_uuid=True), primary_key=True)
    problem_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("problems.id"), nullable=False
    )
    user_id: Mapped[UUID] = mapped_column(
        DBUUID(as_uuid=True), ForeignKey("citizen_users.id"), nullable=False
    )
    latitude: Mapped[Decimal] = mapped_column(DECIMAL(9, 6))
    longitude: Mapped[Decimal] = mapped_column(DECIMAL(9, 6))
    is_solved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    problem = relationship("Problem", back_populates="posts")
    # user = relationship('CitizenUser', back_populates='posts')
    post_likes = relationship("PostLikeBase", back_populates="post")
