from typing import List
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.models.problems import Problem, ProblemItem
from app.schemas.problem import ProblemCreate, ProblemUpdate
from app.crud.base import CRUDBase
from app.models.problems import PostBase
from app.models.user import CitizenUser
from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey, UUID as UUID_Type
import uuid

class CRUDProblem(CRUDBase[Problem, ProblemCreate, ProblemUpdate]):
    def create_with_items(
        self, db_session: Session, *, obj_in: ProblemCreate
    ) -> Problem:
        
        # Problem のデータを保存
        problem_data = {
            "name": obj_in.name,
            "is_open": obj_in.is_open,
        }
        db_obj = self.model(**problem_data)
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        
        # ProblemItem のデータを保存
        for item in obj_in.items:
            problem_item = ProblemItem(
                problem_id=db_obj.id,
                name=item.name,
                type_id=item.type_id
            )
            db_session.add(problem_item)
        
        db_session.commit()
        db_session.refresh(db_obj)
        
        # 市民投稿用の動的テーブルを作成
        self.create_dynamic_post_table(db_session, db_obj.id, obj_in.items)
        
        return db_obj

    def create_dynamic_post_table(self, db_session: Session, problem_id: int, items: List[ProblemItem]):
        """
        市民の投稿を格納するための動的テーブルを作成
        TODO: CommonBaseを継承していない, append_columnのtype, エラーハンドリング, response
        """
        table_name = f"post_{problem_id}"
        metadata = PostBase.metadata
        
        # 動的テーブルの定義
        dynamic_table = Table(
            table_name, metadata,
            Column('id', UUID_Type(as_uuid=True), primary_key=True, default=uuid.uuid4),
            Column('problem_id', Integer, ForeignKey('problems.id')),
            Column('user_id', UUID_Type(as_uuid=True), ForeignKey('citizen_users.id')),
            Column('latitude', String(100)),
            Column('longitude', String(100)),
            Column('is_solved', Integer, default=False),
        )
        
        # ProblemItem のカラムを追加 (item.name と item.type_id を追加)
        for item in items:
            dynamic_table.append_column(Column(f'{item.name}', String(255)))

        # データベースにテーブルを作成
        metadata.create_all(bind=db_session.get_bind())
    

crud_problem = CRUDProblem(Problem)
