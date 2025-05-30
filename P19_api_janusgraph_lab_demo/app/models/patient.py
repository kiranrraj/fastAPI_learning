# app/models/patient.py
from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    not_given = "not given"

class PatientCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    phone: str = Field(..., description="Format +91 1234567890")
    gender: GenderEnum = Field(default=GenderEnum.not_given)
    age: int = Field(..., ge=0, le=120)

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        name = name.strip()
        if not name.isalpha():
            raise ValueError("Name must contain only alphabetic characters")
        return name.title()
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, phone: str) -> str:
        if not phone.startswith("+91"):
            raise ValueError("Phone number must start with +91")
        digits = phone[3:].replace(" ", "")
        if not digits.isdigit() or len(digits) != 10:
            raise ValueError("Phone number must be 10 digits")
        return phone

class Patient(PatientCreate):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))

    @model_serializer
    def serialize_created_at(self) -> str:
        return format_datetime_to_ist(self.created_at)
