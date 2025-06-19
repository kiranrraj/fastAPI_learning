from datetime import datetime
from typing import Optional, Dict, List
from app.models.labx_base_model import LabXBaseModel


class InvestigationCreate(LabXBaseModel):
    investigation_id: str
    name: str
    unit: Optional[str] = None
    reference_range: Optional[Dict[str, float]] = None  
    group_ids: Optional[List[str]] = []


class InvestigationUpdate(LabXBaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    reference_range: Optional[Dict[str, float]] = None
    group_ids: Optional[List[str]] = None


class InvestigationRead(InvestigationCreate):
    id: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
