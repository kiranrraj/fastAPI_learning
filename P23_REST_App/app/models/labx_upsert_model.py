from pydantic import BaseModel
from typing import List, Dict

class UpsertRequest(BaseModel):
    allow_update: bool = False
    records: List[Dict]
