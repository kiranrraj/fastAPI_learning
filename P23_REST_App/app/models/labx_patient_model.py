from typing import Optional
from datetime import datetime
from app.models.labx_base_model import LabXBaseModel

class PatientCreate(LabXBaseModel):
    user_id: str
    first_name: str
    last_name: str
    gender: str
    age: int
    phone: str

class PatientUpdate(LabXBaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    phone: Optional[str] = None

class PatientRead(PatientCreate):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
