import hashlib
import json
from typing import Dict, Any


def normalize_vertex_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize the vertex data:
    - Remove volatile keys (like 'id', timestamps)
    - Sort keys for consistent hash generation
    - Flatten single-element lists
    """
    ignored_keys = {"id", "created_at", "updated_at", "recorded_at"}
    normalized = {}

    for k, v in data.items():
        if k in ignored_keys:
            continue
        if isinstance(v, list) and len(v) == 1:
            normalized[k] = v[0]
        elif isinstance(v, (dict, list)):
            normalized[k] = json.dumps(v, sort_keys=True)
        else:
            normalized[k] = v

    return dict(sorted(normalized.items()))


def hash_vertex_data(data: Dict[str, Any]) -> str:
    """
    Create a consistent hash of the normalized vertex dictionary.
    """
    normalized = normalize_vertex_data(data)
    json_string = json.dumps(normalized, sort_keys=True)
    return hashlib.sha256(json_string.encode("utf-8")).hexdigest()
