from app.api.routes import admin_user, login, post_problem, problem, users, utils
from fastapi import APIRouter

api_router = APIRouter()


api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin_user.router, prefix="/admin_user", tags=["admin_user"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(problem.router, prefix="/problem", tags=["problem"])
api_router.include_router(
    post_problem.router, prefix="/post_problem", tags=["post_problem"]
)
