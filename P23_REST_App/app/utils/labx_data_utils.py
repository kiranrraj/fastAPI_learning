from datetime import datetime
from typing import Dict, Any
import logging

logger = logging.getLogger("labx-logger")

def normalize_gremlin_record(record: Dict[str, Any]) -> Dict[str, Any]:
    record["id"] = record.pop("T.id", record.pop("1", None))
    record.pop("T.label", None)
    record.pop("4", None)

    for dt_field in ["created_at", "updated_at"]:
        val = record.get(dt_field)
        if isinstance(val, str):
            try:
                record[dt_field] = datetime.strptime(val, "%m/%d/%Y %H:%M:%S")
            except ValueError:
                try:
                    record[dt_field] = datetime.fromisoformat(val)
                except ValueError:
                    logger.warning(f"[Normalize] Invalid datetime format for {dt_field}: {val}")
                    record[dt_field] = None
    return record
