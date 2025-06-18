# /app/utils/lax_model_bundle_utils.py
from typing import Type
from pydantic import BaseModel

class ModelBundle:
    def __init__(self, Create: Type[BaseModel], Update: Type[BaseModel], Read: Type[BaseModel]):
        self.Create = Create
        self.Update = Update
        self.Read = Read
