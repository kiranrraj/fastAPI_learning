# app/utils/labx_status_utils.py

from app.logger import get_logger
from typing import List, Dict, Any

logger = get_logger("labx-logger")


# Used in upsert operations (insert + update + skipped + error)

def determine_overall_status(results: List[Dict[str, Any]]) -> str:

    statuses = {r.get("status", "error") for r in results}
    logger.debug(f"[StatusCalc] Detected statuses: {statuses}")

    if statuses == {"not_updated"}:
        return "not_updated"
    elif statuses.issubset({"inserted", "updated", "deleted"}):
        return "success"
    elif statuses.issubset({"skipped"}):
        return "skipped"
    elif statuses.issubset({"error", "not_found"}):
        return "failed"
    else:
        return "partial"


# Used in ID-based operations (like delete_vertices)
# Evaluates statuses like deleted, not_found, or error
def determine_id_result_status(results: List[Dict[str, Any]]) -> str:

    statuses = {r.get("status", "error") for r in results}
    logger.debug(f"[IDStatusCalc] Statuses for ID-based ops: {statuses}")

    if statuses == {"deleted"}:
        return "success"
    elif statuses == {"not_found"}:
        return "not_found"
    elif statuses == {"error"}:
        return "failed"
    else:
        return "partial"
