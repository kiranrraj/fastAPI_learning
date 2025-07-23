# routers/companies.py
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.companies import CompanyListItem, ProtocolListItem, SiteDashboardItem
from config import COMPANY_COL

router = APIRouter(tags=["Companies", "Protocols", "Sites"])
logger = logging.getLogger(__name__)

@router.get("/api/v1/companies", response_model=List[CompanyListItem])
async def list_companies(current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    cursor = db[COMPANY_COL].find({}, {"companyId":1, "companyName":1, "_id":0})
    return await cursor.to_list(length=None)

@router.get("/api/v1/companies/{company_id}")
async def get_company(company_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    comp = await db[COMPANY_COL].find_one({"companyId": company_id}, {"_id":0})
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
    return comp

@router.get("/api/v1/companies/{company_id}/protocols", response_model=List[ProtocolListItem])
async def list_protocols_for_company(company_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$unwind": "$protocols"},
        {"$project": {"_id":0, "protocolId":"$protocols.protocolId", "protocolName":"$protocols.protocolName"}}
    ]
    return await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)

@router.get("/api/v1/protocols/{protocol_id}/sites", response_model=List[SiteDashboardItem])
async def list_sites_for_protocol(protocol_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    pipeline = [
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols"},
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols.sites"},
        {"$replaceRoot": {"newRoot": "$protocols.sites"}},
        {"$project": {
            "_id": 0,
            "siteId": 1,
            "siteName": 1,
            "country": 1,
            "location": {"lat": "$latitude", "lng": "$longitude"},
            "sitePerformanceSummary": {
                "totalTrialsDone":           "$sitePerformance.totalTrialsDone",
                "trialSuccessRate":          "$sitePerformance.trialSuccessRate",
                "totalSubjectsEnrolledCount":"$sitePerformance.totalSubjectsEnrolledCount",
                "subjectSuccessRate":        "$sitePerformance.subjectSuccessRate",
                "enrollmentRatePerTrial":    "$sitePerformance.enrollmentRatePerTrial",
                "dropoutRatePerTrial":       "$sitePerformance.dropoutRatePerTrial"
            }
        }}
    ]
    sites = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    if not sites:
        raise HTTPException(status_code=404, detail="Protocol not found or no sites")
    return sites