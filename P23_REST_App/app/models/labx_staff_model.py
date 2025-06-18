from datetime import datetime
from typing import Optional
from app.models.labx_base_model import LabXBaseModel

class StaffCreate(LabXBaseModel):
    staff_id: str
    first_name: str
    last_name: str
    role: str
    branch_id: str
    phone: str

class StaffUpdate(LabXBaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    branch_id: Optional[str] = None
    phone: Optional[str] = None

class StaffRead(StaffCreate):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
