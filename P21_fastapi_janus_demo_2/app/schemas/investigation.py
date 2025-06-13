from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin

class InvestigationBase(BaseModel):
    """
    Shared fields for Investigations.
    """
    name:            str = Field(..., description="Test name")
    unit:            str = Field(..., description="Measurement unit, e.g. mg/dL")
    reference_range: Optional[str] = Field(None, description="Normal range description")
    group_id:        Optional[UUID] = Field(None, description="Parent group UUID")
    ordered_by:      Optional[UUID] = Field(None, description="Staff UUID who orders")
    investigation_id:str = Field(..., description="External test code")

    model_config = ConfigDict(from_attributes=True)

class InvestigationCreate(InvestigationBase):
    """Fields to create a new investigation."""
    ...

class InvestigationUpdate(BaseModel):
    """
    Optional fields for updating an investigation.
    """
    name:            Optional[str] = None
    unit:            Optional[str] = None
    reference_range: Optional[str] = None
    group_id:        Optional[UUID] = None
    ordered_by:      Optional[UUID] = None
    investigation_id:Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class InvestigationRead(InvestigationBase, TimestampMixin):
    """
    Response model: includes 'id' and 'created_at'.
    """
    id: UUID = Field(..., description="Unique investigation ID (UUID)")
