# app/api/proxy.py

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import httpx

from app.dependencies import get_current_user
from app.core.rbac import assert_entity_permission
from app.utils.rbac_utils import get_allowed_items_for_user
from app.core.logger import get_logger

router = APIRouter(prefix="/data", tags=["Data Proxy"])
logger = get_logger("proxy")

# JanusGraph endpoint
JANUS_ENDPOINT = "http://localhost:8000/labx/entity/InvestigationGroup/list"

# Proxy endpoint to fetch data from JanusGraph (now only investigation group with children) and enforce RBAC filtering.
# Filters down to only investigation groups and items the user has access to.
@router.post("/", response_class=JSONResponse)
async def proxy_investigation_data(
    body: Optional[dict] = None,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("_id")
    logger.info(f"[Proxy] Incoming request from user: {user_id}")

    try:
        # Global RBAC gate
        # Set global read permission for InvestigationGroup access
        assert_entity_permission(current_user, "InvestigationGroup", "read")
        logger.info(f"[Proxy] '{user_id}' authorized to read 'InvestigationGroup'")

        # Fetch full dataset from Janus
        # Forward the request to the JanusGraph investigation group endpoint
        async with httpx.AsyncClient(timeout=10.0) as client:
            janus_response = await client.post(JANUS_ENDPOINT, json=body or {})

        if janus_response.status_code != 200:
            logger.error(f"[Proxy] JanusGraph error: {janus_response.status_code} - {janus_response.text}")
            raise HTTPException(
                status_code=janus_response.status_code,
                detail=f"JanusGraph error: {janus_response.text}"
            )

        full_data = janus_response.json()
        logger.info(f"[Proxy] Received {len(full_data)} groups from Janus")

        # RBAC Filtering – Only include allowed groups & items
        filtered_data = []

        for group in full_data:
            group_name = group.get("name")
            if not group_name:
                continue
            
            # Utility returns list of investigations the user can read for this group
            allowed_items = get_allowed_items_for_user(
                current_user,
                group_name,
                full_data,
                permission="read"
            )

            # Skip group with no readable items
            if not allowed_items:
                continue  
            
            # Create a shallow copy of the group with filtered investigations
            group_copy = group.copy()
            group_copy["investigations"] = [
                item for item in group.get("investigations", [])
                if item.get("name") in allowed_items
            ]
            filtered_data.append(group_copy)

        logger.info(f"[Proxy] Filtered {len(filtered_data)} groups for user '{user_id}'")
        return JSONResponse(content=filtered_data)

    except httpx.RequestError as e:
        logger.exception(f"[Proxy] RequestError while contacting JanusGraph: {e}")
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")

    except HTTPException as http_err:
        logger.warning(f"[Proxy] HTTPException raised: {http_err.detail}")
        raise http_err

    except Exception as ex:
        logger.exception(f"[Proxy] Unexpected error: {str(ex)}")
        raise HTTPException(status_code=500, detail="Internal proxy error")
