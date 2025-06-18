from datetime import datetime
from typing import Optional
from app.models.labx_base_model import LabXBaseModel


class BranchCreate(LabXBaseModel):
    branch_code: str
    name: str
    location: str
    address: str
    phone: str


class BranchUpdate(LabXBaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class BranchRead(BranchCreate):
    id: str
    created_at: datetime
    updated_at: datetime
