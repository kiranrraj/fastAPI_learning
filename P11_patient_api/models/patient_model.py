from pydantic import BaseModel, Field
from typing import Annotated

class PatientModel(BaseModel):
    name: Annotated[str, Field(min_length=2)]
    contact: str
    address: str

