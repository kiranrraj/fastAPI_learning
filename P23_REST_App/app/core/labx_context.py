# labx_app/core/labx_context.py

from app.core.labx_graph_janus import LabXGraphJanus
from typing import Dict, Any
from app.logger import get_logger

logger = get_logger("labx-context")

class LabXContext:
    def __init__(self, graph: LabXGraphJanus):
        self.graph = graph
        self.entity_spec_cache: Dict[str, Dict[str, Any]] = {}
        self.edge_spec_cache: Dict[str, Dict[str, Any]] = {}

    def get_entity_spec(self, entity_name: str, mode: str = "CRUD") -> Dict[str, Any]:
        key = f"{entity_name}:{mode}"
        if key in self.entity_spec_cache:
            return self.entity_spec_cache[key]
        logger.debug(f"Entity spec for '{entity_name}' with mode '{mode}' not cached")
        return {}

    def cache_entity_spec(self, entity_name: str, mode: str, spec: Dict[str, Any]):
        key = f"{entity_name}:{mode}"
        self.entity_spec_cache[key] = spec

    def get_edge_spec(self, edge_name: str) -> Dict[str, Any]:
        if edge_name in self.edge_spec_cache:
            return self.edge_spec_cache[edge_name]
        logger.debug(f"Edge spec for '{edge_name}' not cached")
        return {}

    def cache_edge_spec(self, edge_name: str, spec: Dict[str, Any]):
        self.edge_spec_cache[edge_name] = spec
