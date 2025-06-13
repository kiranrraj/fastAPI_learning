from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin
from .enums import StaffRole

class StaffBase(BaseModel):
    """
    Shared fields for Staff.
    """
    first_name: str = Field(..., description="Staff given name")
    last_name:  str = Field(..., description="Staff family name")
    role:       StaffRole = Field(..., description="Role enum")
    branch_id:  UUID = Field(..., description="UUID of Branch where they work")
    emp_id:     str = Field(..., description="Employee identifier/code")

    model_config = ConfigDict(from_attributes=True)

class StaffCreate(StaffBase):
    """Fields to create a new staff member."""
    ...

class StaffUpdate(BaseModel):
    """
    Optional fields for updating staff.
    All default to None when not provided.
    """
    first_name: Optional[str] = None
    last_name:  Optional[str] = None
    role:       Optional[StaffRole] = None
    branch_id:  Optional[UUID] = None
    emp_id:     Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class StaffRead(StaffBase, TimestampMixin):
    """
    Response model: includes 'id' and 'created_at'.
    """
    id: UUID = Field(..., description="Unique staff ID (UUID)")
