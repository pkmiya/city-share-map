from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.api.deps import CurrentAdminSuperuser, CurrentAdminUser, SessionDep
from app.schemas.problem import Type, Problem, ProblemRead, ProblemCreate, ProblemUpdate, ProblemReadByID
from app.models.problems import Type as DBType, Problem as DBProblem
from app.models.user import User as DBUser
from app.crud.problem import crud_problem

router = APIRouter()


@router.post("/", response_model=Problem)
def create_problem(
    *,
    db: SessionDep,
    current_user: CurrentAdminUser,
    problem_in: ProblemCreate
):
    """
    Create new problem with items.
    """
    problem = crud_problem.create_with_items(
        db_session=db, obj_in=problem_in, user_id=current_user.id
    )
    return problem


@router.get("/", response_model=List[ProblemRead])
def read_problems(
    *,
    db: SessionDep,
    current_user: CurrentAdminUser,
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve problems.
    """
    problems = crud_problem.get_multi_problem(db_session=db, skip=skip, limit=limit)

    return problems

@router.get("/item_type", response_model=List[Type])
def read_item_type(
    *,
    db: SessionDep,
    current_user: CurrentAdminUser,
):
    """
    Retrieve problems.
    """

    item_type=db.query(DBType).all()

    return item_type


@router.get("/data/{id}", response_model=ProblemReadByID)
def read_problem_by_id(
    *,
    db: SessionDep,
    current_user: CurrentAdminUser,
    id: int
):
    """
    Get problem by ID.
    """
    problem = crud_problem.get_problem_by_id(db_session=db, id=id)
    
    return problem


@router.put("/data/{id}", response_model=Problem)
def update_problem(
    *,
    db: SessionDep,
    current_user: CurrentAdminUser,
    id: int,
    problem_in: ProblemUpdate
):
    """
    Get problem posts by ID.
    """
    problem = crud_problem.get(db_session=db, id=id)
    if not problem:
        raise HTTPException(status_code=404, detail="課題が見つかりません")
    problem = crud_problem.update(db_session=db, db_obj=problem, obj_in=problem_in)
    return problem



@router.delete("/data/{id}", response_model=Problem)
def delete_problem(
    *,
    db: SessionDep,
    current_user: CurrentAdminSuperuser,
    id: int
):
    """
    Delete a problem.
    """
    problem = crud_problem.delete_with_items(
        db_session=db, problem_id=id
    )
    return problem
