from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin

class InvestigationGroupBase(BaseModel):
    """
    Shared fields for Investigation Groups.
    """
    name:            str = Field(..., description="Group name")
    description:     Optional[str] = Field(None, description="Optional description")
    parent_group_id: Optional[UUID] = Field(None, description="Parent group UUID")
    created_by:      Optional[UUID] = Field(None, description="Staff UUID")
    group_code:      str = Field(..., description="Internal group code")

    model_config = ConfigDict(from_attributes=True)

class InvestigationGroupCreate(InvestigationGroupBase):
    """Fields to create a new investigation group."""
    ...

class InvestigationGroupUpdate(BaseModel):
    """
    Optional fields for updating a group.
    """
    name:            Optional[str] = None
    description:     Optional[str] = None
    parent_group_id: Optional[UUID] = None
    created_by:      Optional[UUID] = None
    group_code:      Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class InvestigationGroupRead(InvestigationGroupBase, TimestampMixin):
    """
    Response model: includes 'id' and 'created_at'.
    """
    id: UUID = Field(..., description="Unique group ID (UUID)")
