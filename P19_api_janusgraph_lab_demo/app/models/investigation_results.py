# app/models/investigation_result.py
from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional, Union
from datetime import datetime, timezone
from app.utils.time import format_datetime_to_ist

class InvestigationResultCreate(BaseModel):
    value: Union[float, str] = Field(..., description="Result value")
    unit: str = Field(..., min_length=1, max_length=20, description="Unit of measurement")
    investigation_id: UUID = Field(..., description="Linked investigation UUID")
    visit_id: UUID = Field(..., description="Linked visit UUID")
    recorded_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("unit", mode="before")
    @classmethod
    def validate_unit(cls, value: str) -> str:
        return value.strip()

class InvestigationResult(InvestigationResultCreate):
    id: UUID = Field(default_factory=uuid4)

    @model_serializer
    def serialize_recorded_at(self) -> str:
        return format_datetime_to_ist(self.recorded_at)
