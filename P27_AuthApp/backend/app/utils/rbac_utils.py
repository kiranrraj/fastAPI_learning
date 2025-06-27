# app/utils/rbac_utils.py

from typing import List, Dict, Optional
from app.core.rbac import has_entity_permission

# Given an item name, return the group name it belongs to.
def resolve_group_for_item(
    item_name: str,
    investigation_groups: List[Dict]
) -> Optional[str]:
    for group in investigation_groups:
        for item in group.get("investigations", []):
            if item.get("name") == item_name:
                return group.get("name")
    return None

# Given a group name, return a list of all investigation names in that group.
def resolve_items_for_group(
    group_name: str,
    investigation_groups: List[Dict]
) -> List[str]:
    for group in investigation_groups:
        if group.get("name") == group_name:
            return [item.get("name") for item in group.get("investigations", [])]
    return []

# Return only the investigation item names from a group that the user has access to.
# Currently based on group-level permissions.
def get_allowed_items_for_user(
    user: Dict,
    group_name: str,
    investigation_groups: List[Dict],
    permission: str = "read"
) -> List[str]:
    if not has_entity_permission(user, group_name, permission):
        return []

    return resolve_items_for_group(group_name, investigation_groups)
