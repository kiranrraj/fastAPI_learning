from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: str
    message: str
    type: str = "info"
    read: bool = False

class NotificationInDB(NotificationCreate):
    id: str = Field(alias="_id")
    timestamp: datetime

class NotificationPublic(BaseModel):
    id: str
    message: str
    type: str
    read: bool
    timestamp: datetime
