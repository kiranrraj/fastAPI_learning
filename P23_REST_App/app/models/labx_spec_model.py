from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class LabXAttribute(BaseModel):
    name: str
    type: Optional[str] = "text"
    desc: Optional[str] = None
    mandatory: Optional[bool] = False
    id: Optional[str] = None

class LabXEntitySpec(BaseModel):
    entity: str
    mode: str
    attributes: List[LabXAttribute]
    edges: List[Dict[str, Any]]
