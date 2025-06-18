# File: app/utils/labx_model_utils.py
from typing import Any, Dict
import logging
from app.models import ENTITY_MODEL_MAP

logger = logging.getLogger("labx-model-utils")

def sanitize_update_properties(label: str, props: Dict[str, Any]) -> Dict[str, Any]:
    if "record" in props and isinstance(props["record"], dict):
        props = props["record"]

    model_cls = ENTITY_MODEL_MAP.get(label)
    if not model_cls:
        logger.warning(f"No model found for label '{label}' — skipping type coercion.")
        return {k: v for k, v in props.items() if not isinstance(v, (dict, list))}

    try:
        model_instance = model_cls.Update(**props)
        return model_instance.dict(exclude_unset=True, exclude_none=True)
    except Exception as e:
        logger.error(f"Failed to sanitize properties using model '{label}': {e}")
        return {k: v for k, v in props.items() if not isinstance(v, (dict, list))}