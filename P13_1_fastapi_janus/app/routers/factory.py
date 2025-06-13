from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Type, List, Optional
from uuid import UUID
from app.deps.gremlin_client import get_gremlin_client
from gremlin_python.driver.client import Client as GremlinClient


def make_crud_router(
    *,
    prefix: str,
    tag: str,
    vertex_label: str,
    create_schema: Type,
    read_schema: Type,
    update_schema: Type,
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("/{item_id}", response_model=read_schema)
    async def get_item(item_id: UUID, client: GremlinClient=Depends(get_gremlin_client)):
        raw = await client.get_vertex(label=vertex_label, id=str(item_id))
        if not raw:
            raise HTTPException(404, f"{tag[:-1].capitalize()} not found")
        return read_schema.model_validate(raw)

    @router.get("", response_model=List[read_schema])
    async def list_items(
        limit: int = Query(50, ge=1, le=99),
        offset: int = Query(0, ge=0),
        client=Depends(get_gremlin_client)
    ):
        raw_list = await client.list_vertices(
            label=vertex_label, limit=limit, offset=offset, filters={}
        )
        return [read_schema.model_validate(v) for v in raw_list]
    
    @router.post("", response_model=read_schema, status_code=status.HTTP_201_CREATED)
    async def create_item(payload: create_schema, client: GremlinClient=Depends(get_gremlin_client)):
        props = payload.model_dump()
        vid = await client.add_vertex(label=vertex_label, properties=props)
        raw = await client.get_vertex(label=vertex_label, id=vid)
        return read_schema.model_validate(raw)
    
    @router.put("/{item_id}", response_model=read_schema)
    async def update_item(item_id: UUID, payload: update_schema,
    client=Depends(get_gremlin_client)):
        data = {k: v for k,v in payload.model_dump().items() if v is not None}
        ok = await client.update_vertex(label=vertex_label, id=str(item_id), properties=data)
        if not ok:
            raise HTTPException(404, f"{tag[:-1].capitalize()} not found")
        raw = await client.get_vertex(label=vertex_label, id=str(item_id))
        return read_schema.model_validate(raw)

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(item_id: UUID, client: GremlinClient=Depends(get_gremlin_client)):
        ok = await client.delete_vertex(label=vertex_label, id=str(item_id))
        if not ok:
            raise HTTPException(404, f"{tag[:-1].capitalize()} not found")

    return router