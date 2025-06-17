from typing import List, Dict, Any
import logging

logger = logging.getLogger("labx-logger")

# Map of unique fields per entity
UNIQUE_KEYS_MAP = {
    "Patient": ["user_id"],
    "Staff": ["staff_id"],
    "Order": ["order_id"],
    "Branch": ["branch_code"],
    "Investigation": ["investigation_id"],
    "InvestigationGroup": ["group_id"],
    "Result": ["result_id"],
}

async def filter_duplicates(graph, entity_name: str, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Filters out rows that already exist in the graph based on unique keys.
    """
    unique_keys = UNIQUE_KEYS_MAP.get(entity_name, [])
    if not unique_keys:
        logger.warning(f"[FilterDuplicates] No unique key defined for '{entity_name}'")
        return rows

    filtered = []
    for row in rows:
        filter_by = {k: row[k] for k in unique_keys if k in row}
        if not filter_by:
            logger.warning(f"[FilterDuplicates] No valid unique key in row: {row}")
            continue

        existing = await graph.query_vertices(label=entity_name, filters=filter_by, limit=1)
        if existing:
            logger.info(f"[FilterDuplicates] Duplicate found for '{entity_name}' with {filter_by}, skipping.")
            continue

        filtered.append(row)

    return filtered
