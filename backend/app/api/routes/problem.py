from typing import List
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import CurrentUser, SessionDep
from app.schemas.problem import Problem, ProblemCreate, ProblemUpdate
from app.models.problems import Problem as DBProblem
from app.crud.problem import crud_problem

router = APIRouter()


@router.post("/", response_model=str)
def create_problem(
    *,
    db: SessionDep,
    current_user: CurrentUser,
    problem_in: ProblemCreate
):
    """
    Create new problem with items.
    """
    problem = crud_problem.create_with_items(
        db_session=db, obj_in=problem_in
    )
    return "success"


@router.get("/", response_model=List[Problem])
def read_problems(
    *,
    db: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve problems.
    """
    problems = crud_problem.get_multi(db_session=db, skip=skip, limit=limit)
    return problems



# @router.get("/{id}", response_model=Problem)
# def read_problem(
#     *,
#     db: SessionDep,
#     current_user: CurrentUser,
#     id: int
# ):
#     """
#     Get problem by ID.
#     """
#     problem = crud_problem.item_get(db_session=db, id=id)
#     if not problem:
#         raise HTTPException(status_code=404, detail="Problem not found")
#     return problem


# @router.get("posts/{id}", response_model=Problem)
# def read_problem_posts(
#     *,
#     db: SessionDep,
#     current_user: CurrentUser,
#     id: int
# ):
#     """
#     Get problem posts by ID.
#     """
#     problem = crud_problem.get(db_session=db, id=id)
#     if not problem:
#         raise HTTPException(status_code=404, detail="Problem not found")
#     return problem


# @router.delete("/{id}", response_model=Problem)
# def delete_problem(
#     *,
#     db: SessionDep,
#     current_user: CurrentUser,
#     id: int
# ):
#     """
#     Delete a problem.
#     """
#     problem = crud_problem.get(db_session=db, id=id)
#     if not problem:
#         raise HTTPException(status_code=404, detail="Problem not found")
#     problem = crud_problem.delete(db_session=db, id=id)
#     return problem
