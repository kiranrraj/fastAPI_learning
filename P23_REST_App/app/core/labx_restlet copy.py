# /core/labx_restlet.py
# copy

from app.models.labx_spec_model import LabXEntitySpec, LabXAttribute
from app.utils.entity_utils import filter_duplicates
from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
from app.exceptions import SpecValidationError
from app.logger import get_logger
from typing import Any, Dict, List, Tuple
import pandas as pd
import json

logger = get_logger("labx-logger")

class LabXRestlet:
    def __init__(self, context: LabXContext):
        self.context = context
        self.graph: LabXGraphJanus = context.graph

    async def get_spec(self, entity_name: str, mode: str = "CRUD") -> LabXEntitySpec:
        try:
            cached = self.context.get_entity_spec(entity_name, mode)
            if cached:
                logger.debug(f"[Spec] Cache hit for entity='{entity_name}', mode='{mode}'")
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

            attributes_raw = await self.graph.submit(query_entity)
            edges = await self.graph.submit(query_edges)

            attributes: List[LabXAttribute] = []
            for item in attributes_raw:
                attr_map = item.get("attr", {})
                try:
                    attributes.append(
                        LabXAttribute(
                            name=attr_map.get("name", [""])[0],
                            type=attr_map.get("type", ["text"])[0],
                            desc=attr_map.get("desc", [""])[0] if "desc" in attr_map else None,
                            mandatory=attr_map.get("mandatory", [False])[0],
                            id=attr_map.get("id", [""])[0] if "id" in attr_map else None
                        )
                    )
                except Exception as e:
                    logger.warning(f"[Spec] Failed to parse attribute: {attr_map}", exc_info=e)

            spec = LabXEntitySpec(
                entity=entity_name,
                mode=mode,
                attributes=attributes,
                edges=edges
            )

            self.context.cache_entity_spec(entity_name, mode, spec)
            logger.debug(f"[Spec] Cached entity spec for entity='{entity_name}', mode='{mode}'")
            return spec

        except Exception as e:
            logger.error(f"[Spec] Error retrieving spec for entity='{entity_name}'", exc_info=e)
            raise

    def transform_input(
        self,
        entity_name: str,
        params: List[Dict[str, Any]],
        mode: str,
        spec: LabXEntitySpec
    ) -> Tuple[Dict[str, pd.DataFrame], Dict[str, pd.DataFrame]]:
        try:
            attr_records = spec.attributes
            vertex_fields = set()
            edge_fields = {}

            for item in attr_records:
                try:
                    if isinstance(item, LabXAttribute):
                        if item.type in ("ChildEdge - One", "ChildEdge - Multi", "ParentEdge"):
                            edge_fields[item.name] = item.type
                        else:
                            vertex_fields.add(item.name)
                except Exception as e:
                    logger.warning(f"[Transform] Failed parsing attribute definition: {item}", exc_info=e)

            vertices: Dict[str, pd.DataFrame] = {}
            edges: Dict[str, pd.DataFrame] = {}

            for row in params:
                try:
                    vertex_data = {k: v for k, v in row.items() if k in vertex_fields}
                    edge_data = {k: v for k, v in row.items() if k in edge_fields}

                    if entity_name not in vertices:
                        vertices[entity_name] = pd.DataFrame([vertex_data])
                    else:
                        vertices[entity_name] = pd.concat([vertices[entity_name], pd.DataFrame([vertex_data])], ignore_index=True)

                    for edge_label, targets in edge_data.items():
                        edge_targets = targets if isinstance(targets, list) else [targets]
                        edge_rows = [{"from": row.get("id"), "to": tgt_id} for tgt_id in edge_targets if tgt_id]
                        if edge_label not in edges:
                            edges[edge_label] = pd.DataFrame(edge_rows)
                        else:
                            edges[edge_label] = pd.concat([edges[edge_label], pd.DataFrame(edge_rows)], ignore_index=True)

                except Exception as e:
                    logger.warning(f"[Transform] Failed to process row: {row}", exc_info=e)

            return vertices, edges

        except Exception as e:
            logger.error(f"[Transform] Error transforming input for entity='{entity_name}'", exc_info=e)
            raise
    
    # return_ids: bool = True # for security reasons, disable id return 
    async def addupdatelist(
        self, entity_name: str, params: List[Dict[str, Any]], return_ids: bool = True
    ) -> List[str] | bool:
        try:
            spec = await self.get_spec(entity_name, mode="CRUD")

            # Filter duplicates using external util
            filtered_params = await filter_duplicates(self.graph, entity_name, params)

            if not filtered_params:
                logger.warning(f"[Upsert] All records for '{entity_name}' were duplicates, nothing inserted.")
                return [] if return_ids else False

            # Continue as before
            vertices, edges = self.transform_input(entity_name, filtered_params, mode="store", spec=spec)
            result = await self.graph.store(vertices=vertices, edges=edges)

            if return_ids:
                inserted_ids = []
                if isinstance(result, dict) and entity_name in result:
                    inserted_ids = result[entity_name]
                elif isinstance(result, list):  # fallback if store() returns just a list
                    inserted_ids = result

                if inserted_ids:
                    logger.info(f"[Upsert] Successfully inserted {len(inserted_ids)} '{entity_name}' records: {inserted_ids}")
                    return inserted_ids
                else:
                    logger.warning(f"[Upsert] No inserted IDs returned for '{entity_name}': {result}")
                    return []

        except Exception as e:
            logger.error(f"[Upsert] Exception during insert for '{entity_name}'", exc_info=e)
            return [] if return_ids else False


    async def deletelist(self, entity_name: str, ids: List[str]) -> Dict[str, Any]:
        if not ids:
            return {"status": "failed", "message": "No IDs provided", "results": []}

        return await self.graph.delete_vertices(label=entity_name, ids=ids)



    async def list(self, entity_name: str, params: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        try:
            spec = await self.get_spec(entity_name, mode="GET")
            filters, _ = self.transform_input(entity_name, params, mode="list", spec=spec)
            filter_row = filters.get(entity_name)

            try:
                limit = int(params[0].get("limit", 100)) if params else 100
                skip = int(params[0].get("skip", 0)) if params else 0
            except (ValueError, TypeError) as e:
                logger.warning(f"[List] Invalid pagination parameters: {params[0]}", exc_info=e)
                limit = 100
                skip = 0

            return await self.graph.query_vertices(
                label=entity_name,
                filters=filter_row.iloc[0].to_dict() if filter_row is not None else {},
                limit=limit,
                skip=skip
            )
        except Exception as e:
            logger.error(f"[List] Failed for entity='{entity_name}'", exc_info=e)
            return []

    async def add_entity_spec(self, entity_dict: Dict[str, Any]) -> bool:
        try:
            return await self.addupdatelist("LabXEntity", [entity_dict])
        except Exception as e:
            logger.error("[AddEntitySpec] Failed", exc_info=e)
            return False

    async def add_entity_attrs(self, entity_name: str, attr_list: List[Dict[str, Any]]) -> bool:
        try:
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
        except Exception as e:
            logger.error(f"[AddEntityAttrs] Failed for entity='{entity_name}'", exc_info=e)
            return False

    async def add_edge_spec(self, edge_dict: Dict[str, Any]) -> bool:
        try:
            return await self.addupdatelist("LabXEdge", [edge_dict])
        except Exception as e:
            logger.error("[AddEdgeSpec] Failed", exc_info=e)
            return False

    async def add_edge_attrs(self, edge_name: str, attr_list: List[Dict[str, Any]]) -> bool:
        try:
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
        except Exception as e:
            logger.error(f"[AddEdgeAttrs] Failed for edge='{edge_name}'", exc_info=e)
            return False
