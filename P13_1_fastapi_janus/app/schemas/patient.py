# app/schemas/patient.py
from pydantic import BaseModel, ConfigDict, Field
from enum import Enum
from uuid import UUID
from datetime import datetime
from typing import Optional, Union 


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
        examples=["John", "Jane"]
    )
    last_name: str = Field(
        ...,
        min_length=2,
        max_length=50, 
        pattern=r"^[a-zA-Z\s\-']+$",
        description="Patient's last name",
        examples=["Doe", "Smith"]
    )

    phone: str = Field(
        ...,
        min_length=10, 
        max_length=15, 
        pattern=r"^\+?\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$", 
        description="Primary phone number (e.g., +1-555-123-4567 or 555-123-4567)",
        examples=["+15551234567", "555-123-4567"]
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
        examples=[30, 65]
    )

    model_config = ConfigDict(from_attributes=True)

class PatientCreate(PatientBase):
    pass # No additional fields needed for creation beyond PatientBase

class PatientUpdate(BaseModel):

    first_name: Optional[str] = Field(
        None, 
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="Patient's new first name (optional)",
        examples=["Bob"]
    )
    last_name: Optional[str] = Field(
        None, 
        min_length=2,
        max_length=50,
        pattern=r"^[a-zA-Z\s\-']+$",
        description="Patient's new last name (optional)",
        examples=["White"]
    )
    phone: Optional[str] = Field(
        None, 
        min_length=10,
        max_length=15,
        pattern=r"^\+?\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$",
        description="Primary new phone number (optional)",
        examples=["+12345678900"]
    )
    gender: Optional[Gender] = Field(
        None, 
        description="Patient's new gender (optional)",
        examples=[Gender.female]
    )
    age: Optional[int] = Field(
        None, 
        ge=0,
        le=120,
        description="New age in years (optional)",
        examples=[70]
    )

    model_config = ConfigDict(from_attributes=True)

class PatientRead(PatientBase):
    id: UUID = Field(..., description="Unique Patient ID", examples=[UUID('123e4567-e89b-12d3-a456-426614174000')])
    created_at: datetime = Field(..., description="Creation timestamp", examples=[datetime.now()])

