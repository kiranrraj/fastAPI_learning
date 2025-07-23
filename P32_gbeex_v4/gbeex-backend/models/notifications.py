# models/notifications.py
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

class Notification(BaseModel):
    id: str
    userId: str
    title: str
    message: str
    type: str
    icon: str
    timestamp: datetime
    read: bool
    link: Optional[str]
    metadata: Dict[str, Any]