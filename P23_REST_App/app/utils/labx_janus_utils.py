import json
from datetime import datetime
from typing import Any, Dict, List
import logging
import pandas as pd  # Required for dataframe_to_dict_list

logger = logging.getLogger("gremlin-utils")

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
    """
    Converts a Pandas DataFrame into a list of dictionaries.
    Handles NaNs by converting them to None.
    """
    if df is None or df.empty:
        return []
    return df.where(pd.notnull(df), None).to_dict(orient="records")
