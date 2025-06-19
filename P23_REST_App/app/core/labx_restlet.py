# File: app/core/labx_restlet.py
import json
import pandas as pd
from typing import Any, Dict, List, Tuple
from fastapi.encoders import jsonable_encoder

from app.utils.labx_gremlin_utils import (
    flatten_vertex_result,
    clean_element_map,
    dataframe_to_dict_list
)
from app.utils.labx_model_utils import sanitize_update_properties
from app.utils.labx_time_utils import format_to_mmddyyyy_hhmmss
from app.utils.labx_duplicate_utils import filter_duplicates
from app.utils.labx_data_utils import normalize_gremlin_record
from app.utils.labx_status_utils import determine_overall_status
from app.logger import get_logger
from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
from app.models import DeleteResponse, DeleteResultItem
from app.models.labx_spec_model import LabXEntitySpec, LabXAttribute
from app.utils.labx_validation_exceptions import SpecValidationError
from app.utils.labx_gremlin_utils import get_investigation_groups_with_children
from app.models import ENTITY_MODEL_MAP
from pydantic import ValidationError

logger = get_logger("labx-logger")

class LabXRestlet:
    def __init__(self, context: LabXContext):
        self.context = context
        self.graph: LabXGraphJanus = context.graph
        self.CHILD_ENTITY_HANDLERS = {
            "InvestigationGroup": lambda: get_investigation_groups_with_children(self.graph)
        }


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
    
    async def update_existing_records(self, entity_name: str, matched: List[Dict[str, Any]]) -> Dict[str, Any]:
        results = []
        success_ids = []
        failed_ids = []

        logger.info(f"[Update] Starting update for {len(matched)} matched records for '{entity_name}'")

        for record in matched:
            janus_id = record.get("janus_id")
            if not janus_id:
                # Skip records without JanusGraph ID
                logger.warning(f"[Update] Skipping record without janus_id: {record}")
                failed_ids.append(None)
                results.append({
                    "record": record,
                    "status": "error",
                    "message": "Missing JanusGraph ID for update"
                })
                continue

            # Extract update properties excluding janus_id
            update_props = {k: v for k, v in record["record"].items() if k != "janus_id"}
            logger.debug(f"[Update] Updating ID {janus_id} with props: {update_props}")

            update_result = await self.graph.update_vertex(label=entity_name, vertex_id=janus_id, properties=update_props)

            if update_result["status"] == "updated":
                logger.info(f"[Update] Successfully updated vertex ID {janus_id}")
                success_ids.append(janus_id)
                results.append({
                    "record": record["record"],
                    "status": "updated",
                    "id": janus_id,
                    "updated_fields": update_result.get("updated_fields", {})
                })
            elif update_result["status"] == "not_updated":
                # No actual change detected during update
                logger.info(f"[Update] No change for vertex ID {janus_id}")
                results.append({
                    "record": record["record"],
                    "status": "not_updated",
                    "id": janus_id
                })
            else:
                # Catch all unexpected update failures
                logger.error(f"[Update] Error updating vertex ID {janus_id}: {update_result.get('message')}")
                failed_ids.append(janus_id)
                results.append({
                    "record": record["record"],
                    "status": "error",
                    "message": update_result.get("message", "Update failed")
                })

        # Determine overall status across all updates (success, not_updated, failed, partial)
        overall_status = determine_overall_status(results)
        logger.info(f"[Update] Overall update status: {overall_status}")

        return {
            "status": overall_status,
            "results": results,
            "success_ids": success_ids,
            "failed_ids": failed_ids
        }

    async def insert_new_records(self, entity_name: str, unmatched: List[Dict[str, Any]], spec: LabXEntitySpec) -> Dict[str, Any]:
        results = []
        success_ids = []
        failed_ids = []

        if not unmatched:
            # No new records to insert
            return {
                "status": "skipped",
                "results": [],
                "success_ids": [],
                "failed_ids": []
            }

        try:
            logger.info(f"[Insert] Starting insert for {len(unmatched)} unmatched records for '{entity_name}'")

            # Transform raw input into vertex and edge data structures
            vertices, edges = self.transform_input(entity_name, unmatched, mode="store", spec=spec)

            # Send data to graph storage
            store_result = await self.graph.store(vertices=vertices, edges=edges)

            inserted_ids = store_result.get("data", []) if store_result["status"] == "success" else []

            for i, record in enumerate(unmatched):
                vertex_id = inserted_ids[i] if i < len(inserted_ids) else None
                if vertex_id:
                    success_ids.append(vertex_id)
                    results.append({
                        "record": record,
                        "status": "inserted",
                        "id": vertex_id
                    })
                else:
                    failed_ids.append(None)
                    results.append({
                        "record": record,
                        "status": "error",
                        "message": "Insert failed or ID missing"
                    })

        except Exception as e:
            # Log the exception and prepare error response per record
            logger.error(f"[Insert] Error inserting new records for '{entity_name}'", exc_info=e)
            results = [
                {
                    "record": record,
                    "status": "error",
                    "message": str(e)
                } for record in unmatched
            ]
            failed_ids = [None] * len(unmatched)

        # Determine overall outcome of the insert batch
        overall_status = determine_overall_status(results)
        logger.info(f"[Insert] Overall insert status: {overall_status}")

        return {
            "status": overall_status,
            "results": results,
            "success_ids": success_ids,
            "failed_ids": failed_ids
        }

    # async def addupdatelist(self, entity_name: str, params: List[Dict[str, Any]], return_ids: bool = True) -> Dict[str, Any]:
    async def addupdatelist(
        self,
        entity_name: str,
        params: List[Dict[str, Any]],
        return_ids: bool = True,
        allow_update: bool = True
    ) -> Dict[str, Any]:
        # Start upsert operation
        logger.info(f"[Upsert] Starting upsert for entity '{entity_name}' with {len(params)} records")

        # Fetch entity specification (schema, types)
        spec = await self.get_spec(entity_name, mode="CRUD")
        logger.debug(f"[Upsert] Loaded spec for '{entity_name}': {spec}")

        # Deduplicate input records using natural keys
        deduped = await filter_duplicates(self.graph, entity_name, params)
        matched = deduped.get("matched", [])
        unmatched = deduped.get("unmatched", [])

        logger.info(f"[Upsert] Found {len(matched)} matched and {len(unmatched)} unmatched records")

        # Handle matched records (updates or skip)
        if allow_update:
            update_result = await self.update_existing_records(entity_name, matched)
            logger.info(f"[Upsert] Completed update. Success: {len(update_result['success_ids'])}, Failed: {len(update_result['failed_ids'])}")
        else:
            logger.info(f"[Upsert] Skipping update of {len(matched)} matched records due to allow_update=False")
            update_result = {
                "results": [
                    {
                        "record": m["record"],
                        "status": "skipped",
                        "id": m.get("janus_id"),
                        "message": "Update skipped due to allow_update=False"
                    } for m in matched
                ],
                "success_ids": [],
                "failed_ids": [m.get("janus_id") for m in matched]
            }

        # Handle unmatched records (insert)
        insert_result = await self.insert_new_records(entity_name, unmatched, spec)
        logger.info(f"[Upsert] Completed insert. Success: {len(insert_result['success_ids'])}, Failed: {len(insert_result['failed_ids'])}")

        # Combine results
        results = update_result["results"] + insert_result["results"]
        success_ids = update_result["success_ids"] + insert_result["success_ids"]
        failed_ids = update_result["failed_ids"] + insert_result["failed_ids"]

        # Determine final upsert status
        overall_status = determine_overall_status(results)
        logger.info(f"[Upsert] Overall status: {overall_status}, Total processed: {len(results)}")
        logger.info(f"[Upsert] Completed upsert for entity: {entity_name}")

        # Construct response
        response = {
            "status": overall_status,
            "results": results,
            "message": f"Processed {len(results)} record(s) for entity '{entity_name}'"
        }

        if return_ids:
            response["success_ids"] = success_ids
            response["failed_ids"] = failed_ids

        return response

    async def deletelist(self, entity_name: str, ids: List[str]) -> Dict[str, Any]:
        try:
            # Log initiation of deletion
            logger.info(f"[DeleteList] Deleting {len(ids)} ID(s) for entity '{entity_name}'")

            # Perform deletion via graph layer
            result = await self.graph.delete_vertices(label=entity_name, ids=ids)

            # Get per-ID results and compute overall status
            results = result.get("results", [])
            status = determine_overall_status(results)

            logger.info(f"[DeleteList] Completed with status: {status}")

            # Return structured response
            return {
                "status": status,
                "message": result.get("message", f"Processed {len(ids)} ID(s)"),
                "results": results
            }

        except Exception as e:
            # Catch and report failure
            logger.error(f"[DeleteList] Failed to delete for entity '{entity_name}'", exc_info=e)
            return {
                "status": "error",
                "message": str(e),
                "results": []
            }

    async def get_investigations_by_group_ids(self, group_ids: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        try:
            inv_result = await self.graph.query_vertices("Investigation", filters={})
            investigations = inv_result.get("data", []) if inv_result["status"] == "success" else []
            logger.debug(f"[GroupInvestigationMap] Fetched {len(investigations)} Investigations")

            group_map: Dict[str, List[Dict[str, Any]]] = {gid: [] for gid in group_ids}
            for inv in investigations:
                raw_gid = inv.get("group_ids")
                inv_group_ids = [raw_gid] if isinstance(raw_gid, str) else raw_gid or []

                for gid in inv_group_ids:
                    if gid in group_map:
                        group_map[gid].append(inv)

            logger.debug(f"[GroupInvestigationMap] Prepared mapping for {len(group_map)} groups")
            return group_map

        except Exception as e:
            logger.error("[GroupInvestigationMap] Failed to map investigations to groups", exc_info=e)
            return {}

    async def list(self, entity_name: str, params: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        try:
            # Parse incoming parameters
            raw_params = params[0] if params else {}
            limit = int(raw_params.get("limit", 100))
            skip = int(raw_params.get("skip", 0))
            filters = raw_params.get("filter", {})  # filters must be a dict of valid vertex props
            include_children = raw_params.get("include_children", False)  # Check for 'include_children'

            logger.debug(f"[List] Querying entity='{entity_name}' with filters={filters}, limit={limit}, skip={skip}")

            # Query the graph with valid filters
            result = await self.graph.query_vertices(
                label=entity_name,
                filters=filters,
                limit=limit,
                skip=skip
            )

            if result["status"] == "success":
                data = result.get("data", [])
                logger.debug(f"[List] Fetched {len(data)} records for '{entity_name}'")

                # Extract and log T.id values
                janus_ids = [record.get("T.id") for record in data if "T.id" in record]
                logger.debug(f"[List] T.id values: {janus_ids}")

                # If entity is InvestigationGroup and include_children flag is set, fetch children
                if entity_name == "InvestigationGroup" and include_children:
                    # Fetch all parent groups
                    group_map = await self.get_investigations_by_group_ids(janus_ids)
                    logger.debug(f"[List] Group → Investigations map: {group_map}")

                    # Step 1: Identify top-level (parent) groups that have no parent
                    parent_groups = [group for group in data if group.get("parent_group_id") == ""]

                    # Step 2: Fetch children for each parent group and map investigations
                    for parent_group in parent_groups:
                        parent_tid = parent_group.get("T.id")
                        # Find children groups using the parent_group_id
                        child_groups = [group for group in data if group.get("parent_group_id") == parent_tid]
                        if child_groups:
                            parent_group["children"] = child_groups

                        # Add the investigations to the parent group
                        parent_group["investigations"] = group_map.get(parent_tid, [])

                    return data
                else:
                    return data

            else:
                logger.error(f"[List] Query failed for entity '{entity_name}': {result.get('message')}")
                return []

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
