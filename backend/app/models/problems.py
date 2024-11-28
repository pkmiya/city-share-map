from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, UUID, DECIMAL
from sqlalchemy.orm import relationship
import uuid
from app.models.base import Base, CommonColumns
from app.models.user import CitizenUser, PostLikeBase




# Problems Table
class Problem(Base, CommonColumns):
    __tablename__ = 'problems'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)  # 課題の名前
    is_open = Column(Boolean, default=False, nullable=False)  # 現在募集中か
    description = Column(String, nullable=True)  # 課題の説明

    problem_items = relationship('ProblemItem', back_populates='problem')
    posts = relationship('PostBase', back_populates='problem')


# ProblemItems Table
class ProblemItem(Base, CommonColumns):
    __tablename__ = 'problem_items'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    problem_id = Column(Integer, ForeignKey('problems.id'), nullable=False)  # FK to problems
    name = Column(String)  # 項目の名前
    type_id = Column(Integer, ForeignKey('types.id'))  # FK to types
    required = Column(Boolean, default=False)  # 必須かどうか

    problem = relationship('Problem', back_populates='problem_items')
    type = relationship('Type')


# Types Table
class Type(Base):
    __tablename__ = 'types'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)  # 項目の種類


# Posts_<problem_id> Table
class PostBase(Base, CommonColumns):
    __tablename__ = 'posts'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id = Column(Integer, ForeignKey('problems.id'), nullable=False)  # FK to problems
    user_id = Column(UUID(as_uuid=True), ForeignKey('citizen_users.id'), nullable=False)  # FK to citizen_users
    latitude = Column(DECIMAL(9, 6)) # 緯度
    longitude = Column(DECIMAL(9, 6)) # 経度
    is_solved = Column(Boolean, default=False)  # 解決済みどうか

    problem = relationship('Problem', back_populates='posts')
    # user = relationship('CitizenUser', back_populates='posts')
    post_likes = relationship('PostLikeBase', back_populates='post')

