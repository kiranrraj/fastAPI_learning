from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional, List
from datetime import datetime, timezone
from app.utils.time import format_datetime_to_ist

class VisitCreate(BaseModel):
    patient_id: UUID = Field(..., description="UUID of the patient")
    staff_id: Optional[UUID] = Field(None, description="UUID of the staff who recorded the visit")
    branch_id: UUID = Field(..., description="UUID of the branch where visit happened")
    visit_datetime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Date and time of the visit in UTC")
    notes: Optional[str] = Field(None, max_length=500, description="Additional notes about the visit")
    investigation_ids: Optional[List[UUID]] = Field(default_factory=list, description="UUIDs of investigations linked to this visit")

    @field_validator("notes")
    @classmethod
    def strip_strings(cls, value: Optional[str]) -> Optional[str]:
        if value:
            return value.strip()
        return value

class Visit(VisitCreate):
    id: UUID = Field(default_factory=uuid4)
    visit_datetime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @model_serializer
    def serialize_visit_datetime(self) -> str:
        return format_datetime_to_ist(self.visit_datetime)
