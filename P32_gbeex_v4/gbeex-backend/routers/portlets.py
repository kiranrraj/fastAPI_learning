# routers/portlets.py
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from bson import ObjectId # For handling MongoDB _id
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.portlets import Portlet, PortletBase
from config import PORTLET_COL

router = APIRouter(tags=["Portlets"])
logger = logging.getLogger(__name__)

@router.get("/api/v1/portlets", response_model=List[Portlet])
async def list_portlets(current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    try:
        docs = await db[PORTLET_COL].find().to_list(length=None)
        result = []
        for d in docs:
            d["id"] = str(d["_id"])
            result.append(d)
        return result
    except Exception as e:
        logger.error("Error listing portlets: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve portlets"
        )

@router.post("/api/v1/portlets", response_model=Portlet, status_code=status.HTTP_201_CREATED)
async def create_portlet(
    payload: PortletBase,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    try:
        # Check if a portlet with the given key already exists
        existing_portlet = await db[PORTLET_COL].find_one({"key": payload.key})
        if existing_portlet:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Portlet with key '{payload.key}' already exists. Please choose a different key."
            )

        data = jsonable_encoder(payload)
        insert_res = await db[PORTLET_COL].insert_one(data)
        created = await db[PORTLET_COL].find_one({"_id": insert_res.inserted_id})
        if not created:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Portlet created but could not be fetched"
            )
        created["id"] = str(created["_id"])
        return created

    except Exception as e:
        logger.error("Error creating portlet: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create portlet"
        )