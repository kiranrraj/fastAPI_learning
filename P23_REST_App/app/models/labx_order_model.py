from datetime import datetime
from typing import Optional, List, Dict
from app.models.labx_base_model import LabXBaseModel

class OrderCreate(LabXBaseModel):
    order_id: str
    branch_id: str
    staff_id: str
    user_id: str
    investigations: Optional[List[Dict[str, str]]] = None

class OrderUpdate(LabXBaseModel):
    branch_id: Optional[str] = None
    staff_id: Optional[str] = None
    user_id: Optional[str] = None
    investigations: Optional[List[Dict[str, str]]] = None

class OrderRead(OrderCreate):
    id: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]