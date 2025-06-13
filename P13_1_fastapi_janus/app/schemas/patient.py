from pydantic import BaseModel, ConfigDict, Field
from enum import Enum
from uuid import UUID
from datetime import datetime
from typing import Optional


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    not_given = "not_given"


class PatientBase(BaseModel):
    first_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="Patient's first name",
        examples=["Aarav", "Neha"]
    )
    last_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="Patient's last name",
        examples=["Sharma", "Patel"]
    )

    # Indian 10-digit mobile, optional +91 or 91 prefix
    phone: str = Field(
        ...,
        pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        description="10-digit Indian mobile number, with optional country code +91 or 91",
        examples=["+919876543210", "9876543210"]
    )

    gender: Gender = Field(
        ...,
        description="Patient's gender",
        examples=[Gender.male]
    )
    age: int = Field(
        ...,
        ge=0,
        le=120,
        description="Age in years",
        examples=[25, 72]
    )

    model_config = ConfigDict(from_attributes=True)


class PatientCreate(PatientBase):
    """
    All of the fields in PatientBase are required when creating.
    """
    pass


class PatientUpdate(BaseModel):
    """
    Any subset of fields may be updated; None values are ignored.
    """
    first_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="New first name (optional)",
        examples=["Rohan"]
    )
    last_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="New last name (optional)",
        examples=["Gupta"]
    )
    phone: Optional[str] = Field(
        None,
        pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        description="New Indian mobile (optional)",
        examples=["919812345678", "9812345678"]
    )
    gender: Optional[Gender] = Field(
        None,
        description="New gender (optional)",
        examples=[Gender.female]
    )
    age: Optional[int] = Field(
        None,
        ge=0,
        le=120,
        description="New age (optional)",
        examples=[30]
    )

    model_config = ConfigDict(from_attributes=True)


class PatientRead(PatientBase):
    """
    The full read schema includes
     - `id` (UUID)
     - our custom `user_id` string
     - `created_at` + `updated_at` timestamps
    """
    id: UUID = Field(
        ...,
        description="Internal UUID for this patient",
        example=UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    )
    user_id: str = Field(
        ...,
        pattern=r"^[A-Z]{2}\d{6}[A-Z]{2}$",
        description="Generated user-ID (e.g. first 2 letters of name + 6 digits + last 2 letters)",
        examples=["AA123456BB"]
    )
    created_at: datetime = Field(
        ...,
        description="When the patient record was first created",
        example=datetime.utcnow()
    )
    updated_at: datetime = Field(
        ...,
        description="When the patient record was last modified",
        example=datetime.utcnow()
    )

    model_config = ConfigDict(from_attributes=True)
