import uuid

from app.models.base import Base, CommonColumns
from sqlalchemy import UUID, Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base, CommonColumns):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    department = Column(String, index=True)
    # cognito_id = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # cognitoの場合は不要
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)


# CitizenUsers Table
class CitizenUser(Base, CommonColumns):
    __tablename__ = "citizen_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)  # ユーザ名
    line_id = Column(String)  # LIFF連携用のID
    is_active = Column(Boolean, default=True)  # 有効かどうか
    last_login = Column(DateTime)  # 最終ログイン日時

    # posts = relationship('PostBase', back_populates='user')
    post_likes = relationship("PostLikeBase", back_populates="user")


# PostLikes Table
class PostLikeBase(Base, CommonColumns):
    __tablename__ = "post_likes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(
        UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False
    )  # FK to posts
    user_id = Column(
        UUID, ForeignKey("citizen_users.id"), nullable=False
    )  # FK to citizen_users

    post = relationship("PostBase", back_populates="post_likes")
    user = relationship("CitizenUser", back_populates="post_likes")
