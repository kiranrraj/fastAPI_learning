# app/routers/data/testcenter_data.py
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from app.database import get_database
from app.services.testcenter_services import TestcenterService
from app.models.data import TestcenterDataItem 
from app.security.dependencies import get_current_testcenter_user
from app.routes.utils.register_data_router import register_data_router

router = APIRouter(tags=["Test Center Data"])

async def get_testcenter_service(db: AsyncIOMotorClient = Depends(get_database)) -> TestcenterService:
    """Provides a TestcenterService instance with a database connection.""" 
    return TestcenterService(db)

register_data_router(
    router=router,
    path_prefix="/testcenter/data",        
    service_dep=get_testcenter_service, 
    response_model=TestcenterDataItem,
    current_user_dependency=get_current_testcenter_user
)
