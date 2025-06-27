from typing import Dict
from fastapi import HTTPException, status


# Check if a user has a specific permission (read/write/delete) on an entity.
# Admin users get full access to all entities.
# All other users must have explicit permission via entity_access.
def has_entity_permission(user: Dict, entity_name: str, permission: str = "read") -> bool:
    role = user.get("role", "")
    
    # Admins get unrestricted access
    if role == "admin":
        return True

    # Other users: evaluate based on their explicit entity_access
    for access in user.get("entity_access", []):
        if access.get("name") == entity_name:
            return access.get(permission, False) is True

    return False

# Assert that a user has the given permission on a specific entity.
def assert_entity_permission(user: Dict, entity_name: str, permission: str = "read") -> None:
    if not has_entity_permission(user, entity_name, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User does not have {permission} access to '{entity_name}'"
        )
