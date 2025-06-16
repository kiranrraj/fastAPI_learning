# labx_app/core/labx_restlet.py

from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
from app.exceptions import SpecValidationError
from app.logger import get_logger
from typing import Any, Dict, List, Tuple
import pandas as pd
import json

logger = get_logger("labx-restlet")

class LabXRestlet:
    def __init__(self, context: LabXContext):
        self.context = context
        self.graph: LabXGraphJanus = context.graph

    async def get_spec(self, entity_name: str, mode: str = "CRUD") -> Dict[str, Any]:
        cached = self.context.get_entity_spec(entity_name, mode)
        if cached:
            return cached

        query_entity = (
            f"g.V().hasLabel('LabXEntity').has('name', '{entity_name}')"
            ".as('entity').outE('labx_attr_entity').as('e').inV().as('attr')"
            ".project('entity', 'attr')"
            ".by(__.select('entity').valueMap(true))"
            ".by(__.select('attr').valueMap(true))"
        )

        query_edges = (
            f"g.V().hasLabel('LabXEdge').or(has('from', '{entity_name}'), has('to', '{entity_name}'))"
            ".as('edge').outE('labx_attr_edge').as('e').inV().as('attr')"
            ".project('edge', 'attr')"
            ".by(__.select('edge').valueMap(true))"
            ".by(__.select('attr').valueMap(true))"
        )

        attributes = await self.graph.submit(query_entity)
        edges = await self.graph.submit(query_edges)

        spec = {
            "entity": entity_name,
            "mode": mode,
            "attributes": attributes,
            "edges": edges
        }

        self.context.cache_entity_spec(entity_name, mode, spec)
        return spec

    def transform_input(
        self,
        entity_name: str,
        params: List[Dict[str, Any]],
        mode: str,
        spec: Dict[str, Any]
    ) -> Tuple[Dict[str, pd.DataFrame], Dict[str, pd.DataFrame]]:
        attr_records = spec.get("attributes", [])
        valid_attr_names = set()
        for item in attr_records:
            if isinstance(item, dict):
                attr = item.get("attr") or {}
                attr_type = attr.get("type")
                if attr_type not in ("ChildEdge - One", "ChildEdge - Multi", "ParentEdge"):
                    valid_attr_names.add(attr.get("name"))

        vertices = {}
        for row in params:
            clean_row = {k: v for k, v in row.items() if k in valid_attr_names}
            df = pd.DataFrame([clean_row])
            if entity_name not in vertices:
                vertices[entity_name] = df
            else:
                vertices[entity_name] = pd.concat([vertices[entity_name], df], ignore_index=True)

        return vertices, {}  # edges not handled here yet

    async def addupdatelist(self, entity_name: str, params: List[Dict[str, Any]]) -> bool:
        spec = await self.get_spec(entity_name, mode="CRUD")
        vertices, edges = self.transform_input(entity_name, params, mode="store", spec=spec)
        return await self.graph.store(vertices=vertices, edges=edges)

    async def delete(self, entity_name: str, params: List[Dict[str, Any]]) -> bool:
        spec = await self.get_spec(entity_name, mode="CRUD")
        filters, _ = self.transform_input(entity_name, params, mode="delete", spec=spec)
        filter_row = filters.get(entity_name)
        if not filter_row or filter_row.empty:
            raise SpecValidationError("No valid delete filter found.")
        return await self.graph.delete(label=entity_name, filter_by=filter_row.iloc[0].to_dict(), type_="vertex")

    async def list(self, entity_name: str, params: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        spec = await self.get_spec(entity_name, mode="GET")
        filters, _ = self.transform_input(entity_name, params, mode="list", spec=spec)
        filter_row = filters.get(entity_name)
        return await self.graph.query_vertices(label=entity_name, filters=filter_row.iloc[0].to_dict() if filter_row is not None else {})

    async def add_entity_spec(self, entity_dict: Dict[str, Any]) -> bool:
        return await self.addupdatelist("LabXEntity", [entity_dict])

    async def add_entity_attrs(self, entity_name: str, attr_list: List[Dict[str, Any]]) -> bool:
        await self.addupdatelist("GXAttr", attr_list)
        now = pd.Timestamp.utcnow().isoformat()
        edge_rows = [
            {
                "from_vertex_type": "GXAttr",
                "from_gid": f"GXAttr:{attr['name']}:0000",
                "to_vertex_type": "LabXEntity",
                "to_gid": f"LabXEntity:{entity_name}:0000",
                "label": "gx_attr_entity",
                "srcid": "labxrestlet",
                "cdt": now,
                "fdt": now,
                "tdt": "0"
            }
            for attr in attr_list
        ]
        return await self.graph.store(vertices=None, edges={"gx_attr_entity": pd.DataFrame(edge_rows)})

    async def add_edge_spec(self, edge_dict: Dict[str, Any]) -> bool:
        return await self.addupdatelist("LabXEdge", [edge_dict])

    async def add_edge_attrs(self, edge_name: str, attr_list: List[Dict[str, Any]]) -> bool:
        await self.addupdatelist("GXAttr", attr_list)
        now = pd.Timestamp.utcnow().isoformat()
        edge_rows = [
            {
                "from_vertex_type": "GXAttr",
                "from_gid": f"GXAttr:{attr['name']}:0000",
                "to_vertex_type": "LabXEdge",
                "to_gid": f"LabXEdge:{edge_name}:0000",
                "label": "gx_attr_edge",
                "srcid": "labxrestlet",
                "cdt": now,
                "fdt": now,
                "tdt": "0"
            }
            for attr in attr_list
        ]
        return await self.graph.store(vertices=None, edges={"gx_attr_edge": pd.DataFrame(edge_rows)})
