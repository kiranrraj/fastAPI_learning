from typing import Any, Dict, List, Optional
from uuid import UUID

from app.client.gremlin_services import GraphService

class GenericLabRestService:
    """
    A single “lab” service that can list, store, update, or delete *any* entity
    in JanusGraph based on the `entity` and `mode` parameters in the request.
    """

    def __init__(self):
        # Reuse your same GraphService with its open WebSocket
        self.client = GraphService()

    async def peek(self) -> Dict[str, Any]:
        """
        Return a minimal descriptor so clients know how to call this service.
        """
        return {
            "service": "GenericLabRest",
            "supported_modes": ["list", "store", "update", "delete"],
            "usage": {
                "endpoint": "/lab",
                "query": {
                    "entity": "NameOfVertexLabel",
                    "mode": "list|store|update|delete",
                    # for list → optional limit/offset
                    # for store/update/delete → payload body defines fields
                }
            }
        }

    async def handle_request(
        self,
        query_params: Dict[str, Any],
        body: Optional[Dict[str, Any]] = None
    ) -> Any:
        """
        Dispatch to the correct GraphService method based on mode.
        - list   → client.list_vertices
        - store  → client.add_vertex
        - update → client.update_vertex
        - delete → client.delete_vertex
        """
        entity = query_params.get("entity")
        mode   = query_params.get("mode", "list").lower()
        if not entity:
            return {"error": "Missing query param: entity"}

        if mode == "list":
            # parse pagination, defaulting to 50/0
            limit  = int(query_params.get("limit", 50))
            offset = int(query_params.get("offset", 0))
            rows: List[dict] = await self.client.list_vertices(
                label=entity, limit=limit, offset=offset, filters={}
            )
            return rows

        if mode == "store":
            # body is a dict of properties for one new vertex
            vid = await self.client.add_vertex(label=entity, properties=body or {})
            return {"id": vid}

        if mode == "update":
            # require body to include "id"
            vid = body.get("id") if body else None
            if not vid:
                return {"error": "Missing body field: id"}
            props = {k: v for k, v in (body or {}).items() if k != "id"}
            ok = await self.client.update_vertex(label=entity, id=str(vid), properties=props)
            return {"updated": ok}

        if mode == "delete":
            vid = body.get("id") if body else None
            if not vid:
                return {"error": "Missing body field: id"}
            ok = await self.client.delete_vertex(label=entity, id=str(vid))
            return {"deleted": ok}

        return {"error": f"Unknown mode: {mode}"}
