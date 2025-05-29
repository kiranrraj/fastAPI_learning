from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional, Union
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist

class InvestigationResultCreate(BaseModel):
    value: Union[float, str] = Field(..., description="Result value")
    unit: str = Field(..., min_length=1, max_length=20, description="Unit of measurement")

    investigation_id: UUID = Field(..., description="Linked Investigation UUID")
    patient_id: UUID = Field(..., description="Patient who received the investigation")
    staff_id: UUID = Field(..., description="Staff member who recorded the result")
    branch_id: Optional[UUID] = Field(None, description="Branch where result was recorded")

    recorded_at: datetime = Field(default_factory=lambda: datetime.now(IST))

    @field_validator("unit", mode="before")
    @classmethod
    def validate_unit(cls, value: str) -> str:
        return value.strip()

class InvestigationResult(InvestigationResultCreate):
    id: UUID = Field(default_factory=uuid4)

    @model_serializer
    def serialize_recorded_at(self) -> str:
        return format_datetime_to_ist(self.recorded_at)
