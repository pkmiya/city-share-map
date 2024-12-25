from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, String, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    id: Any
    __tablename__: str


class CommonColumns:
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_by: Mapped[String] = mapped_column(String, nullable=True)
    updated_by: Mapped[String] = mapped_column(String, nullable=True)


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
