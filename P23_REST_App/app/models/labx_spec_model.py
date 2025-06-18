from typing import List, Dict, Any, Optional
from app.models.labx_base_model import LabXBaseModel


class LabXAttribute(LabXBaseModel):
    name: str
    type: Optional[str] = "text"
    desc: Optional[str] = None
    mandatory: Optional[bool] = False
    id: Optional[str] = None


class LabXEntitySpec(LabXBaseModel):
    entity: str
    mode: str
    attributes: List[LabXAttribute]
    edges: List[Dict[str, Any]]
