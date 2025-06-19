import json
from datetime import datetime
from typing import Any, Dict, List
import logging
import pandas as pd

logger = logging.getLogger("labx-logger")

def gremlin_safe_value(val: Any) -> str:
    if isinstance(val, datetime):
        return json.dumps(val.isoformat())
    elif isinstance(val, str):
        return json.dumps(val)
    return str(val)

def format_gremlin_properties(props: Dict[str, Any]) -> str:
    prop_parts = []
    for k, v in props.items():
        if isinstance(v, (dict, list)):
            logger.warning(f"[FormatProps] Skipping complex field '{k}' of type {type(v)}")
            continue
        safe_val = gremlin_safe_value(v)
        prop_parts.append(f".property('{k}', {safe_val})")
    return "".join(prop_parts)

def flatten_vertex_result(raw: Dict[str, Any]) -> Dict[str, str]:
    flat = {}
    for key, val in raw.items():
        try:
            if isinstance(val, list) and len(val) == 1:
                flat[key] = str(val[0])
            elif isinstance(val, (dict, list)):
                flat[key] = json.dumps(val)
            else:
                flat[key] = str(val)
        except Exception as e:
            logger.warning(f"[FlattenVertex] Skipping key '{key}' due to error: {e}", exc_info=e)
            continue
    return flat

def clean_element_map(raw: Dict[Any, Any]) -> Dict[str, Any]:
    remap_keys = {1: "id", 4: "label"}
    cleaned = {}
    for k, v in raw.items():
        key = remap_keys.get(k, k)
        cleaned[str(key)] = v
    return cleaned

def dataframe_to_dict_list(df: pd.DataFrame) -> List[Dict[str, Any]]:
    if df is None or df.empty:
        return []
    return df.where(pd.notnull(df), None).to_dict(orient="records")

async def get_investigation_groups_with_children(graph) -> List[Dict[str, Any]]:
    logger.info("[GremlinUtils] Fetching InvestigationGroups with children via edges")

    # Step 1: Fetch all top-level groups (no parent_group_id)
    group_result = await graph.query_vertices("InvestigationGroup", filters={"parent_group_id": ""})
    groups = group_result.get("data", []) if group_result["status"] == "success" else []

    final_result = []

    for group in groups:
        gid = group.get("id") or group.get("group_id")
        if not gid:
            continue

        # Step 2: Use edge traversal to fetch children (investigations linked via `inGroup`)
        gremlin = f"""
        g.V().has('InvestigationGroup','id','{gid}')
         .inE('inGroup')
         .outV()
         .valueMap(true)
         .toList()
        """
        children_result = await graph.run_raw_gremlin(gremlin)

        investigations = []
        if children_result["status"] == "success":
            for inv in children_result["data"]:
                investigations.append({
                    "investigation_id": inv.get("investigation_id", [None])[0],
                    "name": inv.get("name", [None])[0],
                    "unit": inv.get("unit", [None])[0],
                    "reference_range": inv.get("reference_range", [{}])[0],
                })

        group["investigations"] = investigations
        final_result.append(group)

    return final_result