# app/api/v1/endpoints/staff.py
from fastapi import APIRouter, HTTPException
from uuid import UUID, uuid4
import logging
from app.models.staff import Staff, StaffCreate
from app.db.memory import staff_db

router = APIRouter()
logger = logging.getLogger("lab_app")

@router.post(
    "/staff",
    response_model=Staff,
    tags=["Staff"]
)
def create_staff(staff_data: StaffCreate):
    new_staff = Staff(**staff_data.model_dump(), id=uuid4())

    if new_staff.id in staff_db:
        raise HTTPException(
            status_code=400,
            detail="Staff with this ID already exists"
        )
    staff_db[new_staff.id] = new_staff
    logger.info(f"Staff created: {new_staff.id}")
    return new_staff
