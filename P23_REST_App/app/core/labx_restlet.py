from app.models.labx_spec_model import LabXEntitySpec, LabXAttribute
from app.utils.labx_validation_exceptions import SpecValidationError
from app.core.labx_graph_janus import filter_duplicates
from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
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
            logger.info(attributes_raw)
            if not attributes_raw:
                logger.error(f"[Spec] Entity spec not found for '{entity_name}'")
                raise SpecValidationError(f"Entity spec not found for '{entity_name}'")
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

    async def addupdatelist(self, entity_name: str, params: List[Dict[str, Any]], return_ids: bool = True) -> Dict[str, Any]:
        results = []
        success_ids = []
        failed_ids = []

        try:
            spec = await self.get_spec(entity_name, mode="CRUD")
            deduped = await filter_duplicates(self.graph, entity_name, params)
            matched = deduped.get("matched", [])
            unmatched = deduped.get("unmatched", [])

            # --- UPDATE matched records ---
            for record in matched:
                janus_id = record.get("janus_id")
                if not janus_id:
                    failed_ids.append(None)
                    results.append({
                        "record": record,
                        "status": "error",
                        "message": "Missing JanusGraph ID for update"
                    })
                    continue

                update_props = {k: v for k, v in record.items() if k != "janus_id"}
                update_result = await self.graph.update_vertex(label=entity_name, vertex_id=janus_id, properties=update_props)

                if update_result["status"] == "updated":
                    success_ids.append(janus_id)
                    results.append({
                        "record": record,
                        "status": "updated",
                        "id": janus_id,
                        "updated_fields": update_result.get("updated_fields", {})
                    })
                elif update_result["status"] == "not_updated":
                    success_ids.append(janus_id)
                    results.append({
                        "record": record,
                        "status": "not_updated",
                        "id": janus_id
                    })
                else:
                    failed_ids.append(janus_id)
                    results.append({
                        "record": record,
                        "status": "error",
                        "message": update_result.get("message", "Update failed")
                    })

            # --- INSERT unmatched records ---
            if unmatched:
                vertices, edges = self.transform_input(entity_name, unmatched, mode="store", spec=spec)
                store_result = await self.graph.store(vertices=vertices, edges=edges)

                if store_result["status"] == "success":
                    inserted_ids = store_result.get("data", [])
                    for i, record in enumerate(unmatched):
                        vertex_id = inserted_ids[i] if i < len(inserted_ids) else None
                        success_ids.append(vertex_id)
                        results.append({
                            "record": record,
                            "status": "inserted",
                            "id": vertex_id
                        })
                else:
                    for record in unmatched:
                        failed_ids.append(None)
                        results.append({
                            "record": record,
                            "status": "error",
                            "message": store_result.get("message", "Insert failed")
                        })

            overall_status = (
                "success" if all(r["status"] in ("inserted", "updated", "not_updated") for r in results)
                else "failed" if all(r["status"] == "error" for r in results)
                else "partial"
            )

            response = {
                "status": overall_status,
                "results": results,
                "message": f"Processed {len(results)} record(s) for entity '{entity_name}'"
            }

            if return_ids:
                response["success_ids"] = success_ids
                response["failed_ids"] = failed_ids

            return response

        except Exception as e:
            logger.error(f"[Upsert] Exception during insert/update for '{entity_name}'", exc_info=e)
            return {
                "status": "error",
                "results": [],
                "message": str(e),
                "success_ids": [],
                "failed_ids": []
            }


    async def deletelist(self, entity_name: str, ids: List[str]) -> Dict[str, Any]:
        if not ids:
            return {"status": "failed", "message": "No IDs provided", "results": []}

        return await self.graph.delete_vertices(label=entity_name, ids=ids)

    async def list(self, entity_name: str, params: List[Dict[str, Any]]) -> Dict[str, Any]:
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

            result = await self.graph.query_vertices(
                label=entity_name,
                filters=filter_row.iloc[0].to_dict() if filter_row is not None else {},
                limit=limit,
                skip=skip
            )

            if result["status"] != "success" or not result.get("data"):
                return {
                    "status": "not_found",
                    "message": f"No records found for entity '{entity_name}' with given filters",
                    "data": []
                }

            return {
                "status": "success",
                "message": f"Listed {len(result['data'])} record(s) for entity '{entity_name}'",
                "data": result["data"]
            }

        except Exception as e:
            logger.error(f"[List] Failed for entity='{entity_name}'", exc_info=e)
            return {
                "status": "error",
                "message": str(e),
                "data": []
            }


    async def add_entity_spec(self, entity_dict: Dict[str, Any]) -> bool:
        try:
            return await self.addupdatelist("LabXEntity", [entity_dict])
        except Exception as e:
            logger.error("[AddEntitySpec] Failed", exc_info=e)
            return False

    async def add_entity_attrs(self, entity_name: str, attr_list: List[Dict[str, Any]]) -> bool:
        try:
            await self.addupdatelist("LabXAttr", attr_list)
            now = pd.Timestamp.utcnow().isoformat()
            edge_rows = [
                {
                    "from_vertex_type": "LabXAttr",
                    "from_gid": f"LabXAttr:{attr['name']}:0000",
                    "to_vertex_type": "LabXEntity",
                    "to_gid": f"LabXEntity:{entity_name}:0000",
                    "label": "LabX_attr_entity",
                    "srcid": "labxrestlet",
                    "cdt": now,
                    "fdt": now,
                    "tdt": "0"
                }
                for attr in attr_list
            ]
            result = await self.graph.store(vertices=None, edges={"LabX_attr_entity": pd.DataFrame(edge_rows)})
            return result["status"] == "success"
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
            await self.addupdatelist("LabXAttr", attr_list)
            now = pd.Timestamp.utcnow().isoformat()
            edge_rows = [
                {
                    "from_vertex_type": "LabXAttr",
                    "from_gid": f"LabXAttr:{attr['name']}:0000",
                    "to_vertex_type": "LabXEdge",
                    "to_gid": f"LabXEdge:{edge_name}:0000",
                    "label": "LabX_attr_edge",
                    "srcid": "labxrestlet",
                    "cdt": now,
                    "fdt": now,
                    "tdt": "0"
                }
                for attr in attr_list
            ]
            result = await self.graph.store(vertices=None, edges={"LabX_attr_edge": pd.DataFrame(edge_rows)})
            return result["status"] == "success"
        except Exception as e:
            logger.error(f"[AddEdgeAttrs] Failed for edge='{edge_name}'", exc_info=e)
            return False
