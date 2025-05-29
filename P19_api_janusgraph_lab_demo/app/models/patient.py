from pydantic import BaseModel, Field, field_validator
from uuid import UUID, uuid4
from enum import Enum
from typing import Optional

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    not_given = "not given"

class PatientCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name :str = Field(..., min_length=2, max_length=50)
    phone: str = Field(..., description="Format +91 1234567890")
    gender: GenderEnum = Field(default=GenderEnum.not_given)
    age: int = Field(..., ge=0, le=120)

    @field_validator("first_name", "last_name") 
    @classmethod
    def validate_name(cls, name: str) -> str:
        if not name.isalpha():
            raise ValueError("Name must contain only alphabetic character")
        return name.strip().title()
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, phone: str) -> str:
        if not phone.startswith("+91"):
            raise ValueError("Phone number must starts with +91")
        digits = phone[3:]
        if not digits.isdigit() or len(digits) != 10:
            raise ValueError("Phone number must be 10 digit")
        return phone

class Patient(PatientCreate):
    id: UUID = Field(default_factory=uuid4)
    
