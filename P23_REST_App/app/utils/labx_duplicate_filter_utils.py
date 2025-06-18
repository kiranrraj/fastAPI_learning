# labx_duplicate_filter_utils.py
import json
from typing import List, Dict, Any
from gremlin_python.process.traversal import T
import logging
from pathlib import Path

logger = logging.getLogger("labx-logger")

def stringify_keys(d: Dict[Any, Any]) -> Dict[str, Any]:
    return {str(k): v for k, v in d.items()}

async def filter_duplicates(
    graph,
    entity_name: str,
    params: List[Dict[str, Any]],
    unique_key: str = "user_id"
) -> Dict[str, List[Dict[str, Any]]]:
    matched = []
    unmatched = []
    full_matched = [] 

    for record in params:
        key_val = record.get(unique_key)
        if not key_val:
            logger.warning(f"[FilterDuplicates] Missing unique key '{unique_key}' in record: {record}")
            unmatched.append(record)
            continue

        query = f"g.V().hasLabel('{entity_name}').has('{unique_key}', {json.dumps(key_val)}).limit(1).elementMap()"
        try:
            result = await graph.submit(query)
            if result and isinstance(result[0], dict):
                element = result[0]
                janus_id = element.get(T.id)  

                if janus_id is not None:
                    logger.info(f"[FilterDuplicates] Found duplicate for '{unique_key}'={key_val} with id={janus_id}")
                    matched.append({
                        "record": record,
                        "janus_id": janus_id,
                        "existing": element  
                    })
                    full_matched.append({
                        "input": record,
                        "matched": stringify_keys(element)
                    })
                else:
                    logger.warning(f"[FilterDuplicates] Duplicate found but ID missing: {element}")
                    unmatched.append(record)
            else:
                unmatched.append(record)
        except Exception as e:
            logger.error(f"[FilterDuplicates] Error checking record: {record}", exc_info=e)
            unmatched.append(record)
    try:
        audit_path = Path("duplicates_found.json")
        with audit_path.open("w", encoding="utf-8") as f:
            json.dump(full_matched, f, indent=2, default=str)
        logger.info(f"[FilterDuplicates] Wrote matched duplicates to: {audit_path.resolve()}")
    except Exception as e:
        logger.error("[FilterDuplicates] Failed to write matched duplicates to file", exc_info=e)

    return {
        "matched": matched,
        "unmatched": unmatched
    }
