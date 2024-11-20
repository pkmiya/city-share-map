from typing import List
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from app.models.problems import Problem, ProblemItem
from app.schemas.problem import ProblemRead, ProblemCreate, ProblemUpdate
from app.crud.base import CRUDBase
from app.models.problems import PostBase
from app.models.user import CitizenUser
from sqlalchemy import text, DateTime, Table, Column, Integer, String, Boolean, ForeignKey, UUID, DECIMAL
import uuid
from fastapi import HTTPException

class CRUDProblem(CRUDBase[Problem, ProblemCreate, ProblemUpdate]):
    def create_with_items(
        self, db_session: Session, *, obj_in: ProblemCreate
    ) -> Problem:

        try:
            existing_problem = db_session.query(self.model).filter_by(name=obj_in.name).first()
            if existing_problem:
                raise HTTPException(status_code=400, detail="同じ名前の課題が既に存在します")
            if not obj_in.items:
                raise HTTPException(status_code=400, detail="課題には少なくとも1つの項目が必要です")
            
            # Problem のデータを保存
            problem_data = {
                "name": obj_in.name,
                "is_open": obj_in.is_open,
            }

            db_obj = self.model(**problem_data)
            db_session.add(db_obj)
            db_session.flush()
            db_session.refresh(db_obj)
            
            # ProblemItem のデータを保存
            for item in obj_in.items:
                if not item.name:
                    raise HTTPException(status_code=400, detail="項目名が空です")
                
                problem_item = ProblemItem(
                    problem_id=db_obj.id,
                    name=item.name,
                    type_id=item.type_id
                )
                db_session.add(problem_item)
            
            db_session.commit()
            
            # 市民投稿用の動的テーブルを作成
            self.create_dynamic_post_table(db_session, db_obj.id, obj_in.items)
            
            return db_obj
        
        except Exception as e:
            # エラーが発生した場合はロールバック
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"課題の作成中にエラーが発生しました: {str(e)}"
                    )

    def create_dynamic_post_table(self, db_session: Session, problem_id: int, items: List[ProblemItem]):
        """
        市民の投稿を格納するための動的テーブルを作成
        TODO: append_columnのtype
        """
        table_name = f"post_{problem_id}"
        metadata = PostBase.metadata
        
        # 動的テーブルの定義
        dynamic_table = Table(
            table_name, metadata,
            Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
            Column('problem_id', Integer, ForeignKey('problems.id')),
            # Column('user_id', UUID(as_uuid=True), ForeignKey('citizen_users.id')),
            Column('user_id', UUID(as_uuid=True)),
            Column('latitude', DECIMAL(9, 6)),
            Column('longitude', DECIMAL(9, 6)),
            Column('is_solved', Boolean, default=False),
        )

        CommonColumns = [
            Column('created_at', DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False),
            Column('updated_at', DateTime, server_onupdate=text("CURRENT_TIMESTAMP")),
            Column('deleted_at', DateTime),
            Column('created_by', String(30)),
            Column('updated_by', String(30)),
        ]
        
        # ProblemItem のカラムを追加 (item.name と item.type_id を追加)
        for item in items:
            dynamic_table.append_column(Column(f'{item.name}', String(255)))
        
        for column in CommonColumns:
            dynamic_table.append_column(column)

        # データベースにテーブルを作成(flushと相性悪い)
        metadata.create_all(bind=db_session.get_bind())
    
    def get_multi_problem(
        self, db_session: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ProblemRead]:
        
        problems = self.get_multi(db_session, skip=skip, limit=limit)

        for problem in problems:
            table_name = f"post_{problem.id}"
            Base = automap_base()
            Base.prepare(db_session.get_bind(), reflect=True)

            try:
                if table_name in Base.classes:
                    dynamic_table = Base.classes[table_name]
                    post_count = db_session.query(dynamic_table).count()
                    setattr(problem, 'post_count', post_count)
                else:
                    setattr(problem, 'post_count', 0)
                setattr(problem, 'created_at', problem.created_at)

            except Exception as e:
                raise HTTPException(status_code=404, detail=f"テーブル '{table_name}' が見つかりません")
        
        return problems


    def delete_with_items(
        self, db_session: Session, *, problem_id: int
    ) -> Problem:
        
        try:
            # 市民投稿用の動的テーブルを削除
            table_name = f"post_{problem_id}"
            metadata = PostBase.metadata
            dynamic_table = Table(table_name, metadata)
            dynamic_table.drop(bind=db_session.get_bind())

            problem = db_session.query(self.model).filter_by(id=problem_id).first()
            if not problem:
                raise HTTPException(status_code=404, detail="課題が見つかりません")

            db_session.query(ProblemItem).filter_by(problem_id=problem_id).delete()

            db_session.delete(problem)
            db_session.commit()

            return problem
        
        except Exception as e:
            db_session.rollback()
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"課題の削除中にエラーが発生しました: {str(e)}"
                )
    

crud_problem = CRUDProblem(Problem)
