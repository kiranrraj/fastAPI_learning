from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Type, List, Optional
from uuid import UUID
from app.client.gremlin_services import get_gremlin_client
from gremlin_python.driver.client import Client as GremlinClient


def make_crud_router( *, prefix: str, tag: str, vertex_label: str, create_schema: Type, read_schema: Type, update_schema: Type,) -> APIRouter:
    
    # Creates a brand-new FastAPI router whose paths all begin with whatever prefix you passed
    router = APIRouter(prefix=prefix, tags=[tag])

    # GET one: Fetch a single item by its unique ID. If nothing’s there, you get a “Not found” error.
    @router.get("/{item_id}", response_model=read_schema)
    async def get_item(item_id: UUID, client: GremlinClient=Depends(get_gremlin_client)):

        # Asks graph client to go fetch one vertex from JanusGraph. await client.get_vertex(...) tells 
        # pause this function until the graph client finishes retrieving data. label=vertex_label 
        # specifies which kind of vertex you want. id=str(item_id) turns the UUID you received into a string,
        raw = await client.get_vertex(label=vertex_label, id=str(item_id))
        if not raw:
            raise HTTPException(404, f"{tag[:-1].capitalize()} not found")
        return read_schema.model_validate(raw)

    # GET list: Fetch a page of items (you decide how many at a time and where to start).
    @router.get("", response_model=List[read_schema])
    async def list_items(
        limit: int = Query(50, ge=1, le=99),
        offset: int = Query(0, ge=0),
        client=Depends(get_gremlin_client)
    ):
        # limit=limit is how many items you want, offset=offset is how many items to skip 
        # before starting, filters={} is an empty placeholder
        raw_list = await client.list_vertices(
            label=vertex_label, limit=limit, offset=offset, filters={}
        )
        return [read_schema.model_validate(v) for v in raw_list]
    
    # POST: Create a new item. It checks your input, writes it to JanusGraph, 
    # and then returns the full record (including its new ID and creation time).
    @router.post("", response_model=read_schema, status_code=status.HTTP_201_CREATED)
    async def create_item(payload: create_schema, client: GremlinClient=Depends(get_gremlin_client)):

        # Gives you a plain dictionary of all fields the user sent (including ones set to None).
        props = payload.model_dump()

        # Create the vertex and get its new ID
        vid = await client.add_vertex(label=vertex_label, properties=props)

        # Fetch the freshly created vertex back from the graph
        raw = await client.get_vertex(label=vertex_label, id=vid)
        
        # Validate each field against the rules on your read_schema model
        return read_schema.model_validate(raw)
    
    # UPDATE: Change an existing item. You can send only the fields you want to change; 
    # everything else stays the same. If the ID doesn’t exist, you get “Not found.”
    @router.put("/{item_id}", response_model=read_schema)
    async def update_item(item_id: UUID, payload: update_schema,
    client=Depends(get_gremlin_client)):

        # Prepare only the fields the user sent, ignore None
        data = payload.model_dump(exclude_none=True)

        # Reject if they didn’t send anything to change
        if not data:
            raise HTTPException(status_code=400,detail="At least one field must be provided for update")

        # Attempt the update
        ok = await client.update_vertex(vertex_label, str(item_id), data)

        # Branch on success or failure
        if ok:
            raw = await client.get_vertex(vertex_label, str(item_id))
            return read_schema.model_validate(raw)
        else:
            raise HTTPException(status_code=404, detail=f"{tag[:-1].capitalize()} not found")

    # DELETE: Remove an item by ID. On success you get an empty 204 response; 
    # if you try to delete something that isn’t there, you get “Not found.”
    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(item_id: UUID, client: GremlinClient=Depends(get_gremlin_client)):
        ok = await client.delete_vertex(label=vertex_label, id=str(item_id))
        if not ok:
            raise HTTPException(404, f"{tag[:-1].capitalize()} not found")

    return router