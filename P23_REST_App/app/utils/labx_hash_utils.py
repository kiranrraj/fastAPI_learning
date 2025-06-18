import hashlib
import json
from typing import Dict, Any
from datetime import datetime

def normalize_vertex_data(data: Dict[str, Any]) -> Dict[str, Any]:
    normalized = {}
    for key, value in data.items():
        str_key = str(key)

        # Flatten single-element lists
        if isinstance(value, list) and len(value) == 1:
            value = value[0]

        # Convert datetime to ISO string
        if isinstance(value, datetime):
            normalized[str_key] = value.isoformat()
        else:
            normalized[str_key] = value

    # Sort by keys for deterministic hash
    return dict(sorted(normalized.items(), key=lambda x: x[0]))




def hash_vertex_data(data: Dict[str, Any]) -> str:
    """
    Create a consistent hash of the normalized vertex dictionary.
    """
    normalized = normalize_vertex_data(data)
    json_string = json.dumps(normalized, sort_keys=True)
    return hashlib.sha256(json_string.encode("utf-8")).hexdigest()
