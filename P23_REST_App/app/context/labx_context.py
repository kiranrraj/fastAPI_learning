# app/context/labx_context.py

from typing import Dict, Tuple
from app.models.labx_spec_model import LabXEntitySpec


class LabContext:
    """
    Minimal implementation of a LabContext.
    Now supports caching of entity specs as Pydantic models.
    """

    def __init__(self, user: str = "anonymous"):
        self.user = user
        self._entity_spec_cache: Dict[Tuple[str, str], LabXEntitySpec] = {}

    def get_user(self) -> str:
        return self.user

    def get_entity_spec(self, entity_name: str, mode: str = "CRUD") -> LabXEntitySpec | None:
        return self._entity_spec_cache.get((entity_name, mode))

    def cache_entity_spec(self, entity_name: str, mode: str, spec: LabXEntitySpec) -> None:
        self._entity_spec_cache[(entity_name, mode)] = spec
