# labx_models.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class LabXBaseModel(BaseModel):
    id: Optional[str] = None

# 1. Branch
class BranchModel(LabXBaseModel):
    branch_code: str
    name: str
    location: str
    address: str
    phone: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# 2. Staff
class StaffModel(LabXBaseModel):
    staff_id: str
    first_name: str
    last_name: str
    role: str
    branch_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# 3. Patient
class PatientModel(LabXBaseModel):
    user_id: str
    first_name: str
    last_name: str
    gender: str
    age: int
    phone: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# 4. InvestigationGroup
class InvestigationGroupModel(LabXBaseModel):
    group_id: str
    name: str
    description: Optional[str] = None
    parent_group_id: Optional[str] = ""
    investigation_ids: Optional[List[str]] = Field(default_factory=list)

# 5. Investigation
class ReferenceRange(BaseModel):
    lower: float
    upper: float

class InvestigationModel(LabXBaseModel):
    investigation_id: str
    name: str
    unit: str
    reference_range: ReferenceRange
    group_ids: List[str] = Field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# 6. Order
class OrderInvestigation(BaseModel):
    inv_id: str
    group_id: str

class OrderModel(LabXBaseModel):
    order_id: str
    branch_id: str
    staff_id: str
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    investigations: Optional[List[OrderInvestigation]] = None

# 7. Result
class ReportItem(BaseModel):
    inv_id: str
    value: float
    range: List[float]
    observation: str
    status: str  # "+ve" / "-ve"

class ResultModel(LabXBaseModel):
    result_id: str
    order_id: str
    staff_id: str
    branch_id: str
    user_id: str
    recorded_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    report: Optional[List[ReportItem]] = None
