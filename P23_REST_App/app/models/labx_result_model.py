from datetime import datetime
from typing import Optional, List, Dict
from app.models.labx_base_model import LabXBaseModel

class ResultCreate(LabXBaseModel):
    result_id: str
    order_id: str
    staff_id: str
    branch_id: str
    user_id: str
    report: Optional[List[Dict[str, str]]] = None 

class ResultUpdate(LabXBaseModel):
    report: Optional[List[Dict[str, str]]] = None

class ResultRead(ResultCreate):
    id: str
    recorded_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
