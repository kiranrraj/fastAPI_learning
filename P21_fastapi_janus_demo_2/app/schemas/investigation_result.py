from typing import Union, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin

class InvestigationResultBase(BaseModel):
    """
    Shared fields for Investigation Results.
    """
    value:           Union[float, str] = Field(..., description="Numeric or textual result")
    unit:            str = Field(..., description="Unit of measurement")
    investigation_id:UUID = Field(..., description="UUID of the investigation type")
    patient_id:      UUID = Field(..., description="UUID of the patient")
    staff_id:        UUID = Field(..., description="UUID of staff who recorded")
    branch_id:       Optional[UUID] = Field(None, description="Branch UUID if known")
    recorded_at:     datetime = Field(..., description="Timestamp when result was recorded")

    model_config = ConfigDict(from_attributes=True)

class InvestigationResultCreate(InvestigationResultBase):
    """Fields to record a new investigation result."""
    ...

class InvestigationResultUpdate(BaseModel):
    """
    Optional fields for updating a result.
    """
    value:           Optional[Union[float, str]] = None
    unit:            Optional[str] = None
    investigation_id:Optional[UUID] = None
    patient_id:      Optional[UUID] = None
    staff_id:        Optional[UUID] = None
    branch_id:       Optional[UUID] = None
    recorded_at:     Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class InvestigationResultRead(InvestigationResultBase):
    """
    Response model: includes 'id'.
    Uses TimestampMixin if you want to alias `recorded_at` to a common field.
    """
    id: UUID = Field(..., description="Unique result ID (UUID)")
