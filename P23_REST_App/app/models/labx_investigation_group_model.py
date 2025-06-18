from datetime import datetime
from typing import Optional
from app.models.labx_base_model import LabXBaseModel


class InvestigationGroupCreate(LabXBaseModel):
    group_id: str
    name: str
    description: Optional[str] = None
    parent_group_id: Optional[str] = None


class InvestigationGroupUpdate(LabXBaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_group_id: Optional[str] = None


class InvestigationGroupRead(InvestigationGroupCreate):
    id: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
