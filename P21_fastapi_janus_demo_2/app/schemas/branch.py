from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin

class BranchBase(BaseModel):
    """
    Shared branch properties.
    """
    name:        str = Field(..., description="Branch name")
    location:    str = Field(..., description="General location/area")
    address:     Optional[str] = Field(None, description="Full postal address")
    phone:       Optional[str] = Field(None, description="Contact phone number")
    branch_code: str = Field(..., description="Internal branch code")

    model_config = ConfigDict(from_attributes=True)

class BranchCreate(BranchBase):
    """Fields to create a new branch."""
    ...

class BranchUpdate(BaseModel):
    """
    Partial update fields for Branch.
    """
    name:        Optional[str] = None
    location:    Optional[str] = None
    address:     Optional[str] = None
    phone:       Optional[str] = None
    branch_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BranchRead(BranchBase, TimestampMixin):
    """
    Response model: includes 'id' and 'created_at'.
    """
    id: UUID = Field(..., description="Unique branch ID (UUID)")
