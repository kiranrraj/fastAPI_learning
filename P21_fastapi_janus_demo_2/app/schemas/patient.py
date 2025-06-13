from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from .base import TimestampMixin
from .enums import Gender

class PatientBase(BaseModel):
    """
    Shared fields for Patient creation & display.
    Excludes 'id' and 'created_at'.
    """
    first_name: str = Field(..., description="Patient's given name")
    last_name:  str = Field(..., description="Patient's family name")
    phone:      str = Field(..., description="Contact phone number")
    gender:     Gender = Field(..., description="Gender enum value")
    age:        int = Field(..., ge=0, description="Age in years, must be non-negative")

    # Tells Pydantic to allow “ORM-style” population from objects with 
    # attributes. By default, Pydantic models expect incoming data to be 
    # in the form of a mapping. This line tells, If the value passed in 
    # is not a dict but instead has attributes corresponding to my fields, 
    # go ahead and pull those attributes off the object
    model_config = ConfigDict(from_attributes=True)

    # Without it: Pydantic only sees dict keys; object attributes are ignored.
    # With it: Pydantic treats object attributes as valid input sources, 
    # making it trivial to model-validate data from ORMs, Gremlin clients, 
    # or any custom classes.

class PatientCreate(PatientBase):
    """
    Fields required to create a new Patient.
    Inherits everything from PatientBase.
    """

class PatientUpdate(BaseModel):
    """
    All fields optional for partial updates (PUT).
    Fields default to None when not provided.
    """
    first_name: Optional[str] = None
    last_name:  Optional[str] = None
    phone:      Optional[str] = None
    gender:     Optional[Gender] = None
    age:        Optional[int] = Field(None, ge=0)

    # Tells Pydantic to allow “ORM-style” population from objects with attributes
    model_config = ConfigDict(from_attributes=True)

class PatientRead(PatientBase, TimestampMixin):
    """
    What is returned in responses:
    - inherits base fields
    - adds 'id' and 'created_at'
    """
    id: UUID = Field(..., description="Unique patient ID (UUID)")
