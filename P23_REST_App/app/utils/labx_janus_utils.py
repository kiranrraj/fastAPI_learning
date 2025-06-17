# labx_janus_utils.py

import json
from datetime import datetime
from typing import Any, Dict
import logging

logger = logging.getLogger("gremlin-utils")

def gremlin_safe_value(val: Any) -> str:
    """
    Converts a Python value to a Gremlin-safe string for query embedding.
    - Strings and datetimes are quoted.
    - Numbers are passed through.
    - Complex objects (dicts/lists) should be handled before this step.
    """
    if isinstance(val, datetime):
        return json.dumps(val.isoformat())
    elif isinstance(val, str):
        return json.dumps(val)
    return str(val)

def format_gremlin_properties(props: Dict[str, Any]) -> str:
    """
    Formats a dict of properties into Gremlin .property('k', v) chain.
    Skips dicts/lists with a warning.
    """
    prop_parts = []
    for k, v in props.items():
        if isinstance(v, (dict, list)):
            logger.warning(f"[FormatProps] Skipping complex field '{k}' of type {type(v)}")
            continue
        safe_val = gremlin_safe_value(v)
        prop_parts.append(f".property('{k}', {safe_val})")
    return "".join(prop_parts)

def flatten_vertex_result(raw: Dict[str, Any]) -> Dict[str, str]:
    """
    Flattens a valueMap(true) result from JanusGraph.
    Converts all values to str, including single-item lists.
    """
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
