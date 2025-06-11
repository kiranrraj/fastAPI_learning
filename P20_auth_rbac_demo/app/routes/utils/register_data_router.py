# app/routers/utils/register_data_router.py

from typing import Type, Callable, Any, List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.base_services import BaseService
from app.models.user import UserInDB
from app.utils.logger import get_logger

logger = get_logger(__name__)

def register_data_router(
    router: APIRouter,
    path_prefix: str,
    service_dep: Callable[..., BaseService],
    response_model: Type[BaseModel],
    current_user_dependency: Callable[..., UserInDB]
):
    """
    Registers standard CRUD endpoints on `router` under `path_prefix`.
    Each endpoint injects:
      - `service`: your BaseService subclass via Depends(service_dep)
      - `current_user`: via Depends(current_user_dependency)
    """

    def derive_entity_name(service: BaseService) -> str:
        return (
            service.collection_name
                   .replace('_data', '')
                   .replace('_', ' ')
                   .title()
        )

    @router.get(f"{path_prefix}/", response_model=List[response_model])
    async def get_all_items(
        service: BaseService = Depends(service_dep),
        current_user: UserInDB = Depends(current_user_dependency)
    ):
        entity_name = derive_entity_name(service)
        logger.info(f"{current_user.username} fetching all {entity_name}")
        try:
            return await service.get_all()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve {entity_name}"
            )

    @router.get(f"{path_prefix}/{{item_id}}", response_model=response_model)
    async def get_item(
        item_id: str,
        service: BaseService = Depends(service_dep),
        current_user: UserInDB = Depends(current_user_dependency)
    ):
        entity_name = derive_entity_name(service)
        logger.info(f"{current_user.username} fetching {entity_name} {item_id}")
        item = await service.get_by_id(item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{entity_name} {item_id} not found"
            )
        return item

    @router.post(f"{path_prefix}/", response_model=response_model,
                 status_code=status.HTTP_201_CREATED)
    async def create_item(
        payload: response_model,
        service: BaseService = Depends(service_dep),
        current_user: UserInDB = Depends(current_user_dependency)
    ):
        entity_name = derive_entity_name(service)
        logger.info(f"{current_user.username} creating new {entity_name}")
        return await service.create(
            payload.model_dump(by_alias=True, exclude_none=True)
        )

    @router.put(f"{path_prefix}/{{item_id}}", response_model=response_model)
    async def update_item(
        item_id: str,
        payload: response_model,
        service: BaseService = Depends(service_dep),
        current_user: UserInDB = Depends(current_user_dependency)
    ):
        entity_name = derive_entity_name(service)
        logger.info(f"{current_user.username} updating {entity_name} {item_id}")
        result = await service.update(
            item_id,
            payload.model_dump(
                by_alias=True,
                exclude_unset=True,
                exclude_none=True
            )
        )
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{entity_name} {item_id} not found"
            )
        return result

    @router.delete(f"{path_prefix}/{{item_id}}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(
        item_id: str,
        service: BaseService = Depends(service_dep),
        current_user: UserInDB = Depends(current_user_dependency)
    ):
        entity_name = derive_entity_name(service)
        logger.info(f"{current_user.username} deleting {entity_name} {item_id}")
        deleted = await service.delete(item_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{entity_name} {item_id} not found"
            )
        # Return an explicit 204 No Content response
        return Response(status_code=status.HTTP_204_NO_CONTENT)
