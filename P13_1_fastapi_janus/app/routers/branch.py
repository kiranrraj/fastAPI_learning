# \app\routers\branch.py
from fastapi import APIRouter
from app.routers.factory import make_crud_router
from app.schemas.branch import BranchCreate, BranchRead, BranchUpdate

router = make_crud_router(
    prefix="/branches",
    tag="Branches",
    vertex_label="Branch",
    create_schema=BranchCreate,
    read_schema=BranchRead,
    update_schema=BranchUpdate,
)
