# app/api/v1/endpoints/branch.py
from fastapi import APIRouter, HTTPException
from uuid import UUID, uuid4
import logging
from app.models.branch import Branch, BranchCreate
from app.db.memory import branches_db
router = APIRouter()
logger = logging.getLogger("lab_app")

@router.post(
    "/branche",
    response_model=Branch,
    tags=["Branches"]
)
def create_branch(branch_data: BranchCreate):
    new_branch = Branch(**branch_data.model_dump(), id=uuid4())
    
    if new_branch.id in branches_db:
        raise HTTPException(
            status_code=400,
            detail="Branch with this ID already exists"
        )
    branches_db[new_branch.id] = new_branch
    logger.info(f"Branch created: {new_branch.id}")
    return new_branch
