from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column, String, DateTime, text


@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class CommonColumns:
    created_at = Column(
        DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False
    )
    updated_at = Column(DateTime, server_onupdate=text("CURRENT_TIMESTAMP"))
    deleted_at = Column(DateTime)
    created_by = Column(String(64))
    updated_by = Column(String(64))


# soft_delete用のコード(なぜか動作しない)
# @event.listens_for(Session, "do_orm_execute")
# def _add_filtering_deleted_at(execute_state):
#     """
#     論理削除用のfilterを自動的に適用する
#     以下のようにすると、論理削除済のデータも含めて取得可能
#     query(...).filter(...).execution_options(include_deleted=True)
#     """

#     if (
#         execute_state.is_select
#         and not execute_state.is_column_load
#         and not execute_state.is_relationship_load
#         and not execute_state.execution_options.get("include_deleted", False)
#     ):
#         execute_state.statement = execute_state.statement.options(
#             orm.with_loader_criteria(
#                 CommonColumns,
#                 lambda cls: cls.deleted_at.is_(None),
#                 include_aliases=True,
#             )
#         )
