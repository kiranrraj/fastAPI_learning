# gbeex-backend/routers/companies.py
import logging
from typing import List, Optional
from math import ceil

from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.companies import CompanyListItem, ProtocolListItem, SiteDashboardItem, \
    Company, Protocol, Site # Ensure all full models are imported
from models.common import PaginatedResponse # For pagination
from config import COMPANY_COL

router = APIRouter(tags=["Companies", "Protocols", "Sites"])
logger = logging.getLogger(__name__)

# List all companies with pagination and optional search
@router.get("/api/v1/companies", response_model=PaginatedResponse[CompanyListItem])
async def list_companies(
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Lists all available companies with pagination and optional search by company name.
    """
    query = {}
    if search_term:
        query["companyName"] = {"$regex": search_term, "$options": "i"}

    total_count = await db[COMPANY_COL].count_documents(query)
    
    skip = (page - 1) * limit
    
    cursor = db[COMPANY_COL].find(query, {"companyId":1, "companyName":1, "_id":0}).skip(skip).limit(limit)
    items = await cursor.to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

# Get a single company by ID
@router.get("/api/v1/companies/{company_id}", response_model=Company)
async def get_company(company_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    """Retrieves full details for a specific company by its ID."""
    # Retrieve the full company document. No projection for nested fields initially.
    company_doc = await db[COMPANY_COL].find_one({"companyId": company_id}, {"_id": 0})
    if not company_doc:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Pydantic will validate the entire document structure
        return Company(**company_doc)
    except Exception as e:
        logger.error(f"Error validating company {company_id}: {e}", exc_info=True) # Added exc_info for full traceback
        raise HTTPException(status_code=500, detail="Error processing company data (validation error). Check data consistency.")

# List protocols for a company with pagination and optional search
@router.get("/api/v1/companies/{company_id}/protocols", response_model=PaginatedResponse[ProtocolListItem])
async def list_protocols_for_company(
    company_id: str,
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Lists protocols associated with a specific company with pagination and optional search by protocol name.
    """
    company_exists = await db[COMPANY_COL].count_documents({"companyId": company_id})
    if company_exists == 0:
        raise HTTPException(status_code=404, detail="Company not found")

    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$unwind": "$protocols"},
    ]
    
    protocol_match_criteria = {}
    if search_term:
        protocol_match_criteria["protocols.protocolName"] = {"$regex": search_term, "$options": "i"}
    if protocol_match_criteria:
        pipeline.append({"$match": protocol_match_criteria})

    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        {"$project": {"_id":0, "protocolId":"$protocols.protocolId", "protocolName":"$protocols.protocolName"}}
    ])
    
    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

# NEW GLOBAL LIST ENDPOINT: List all protocols with pagination and optional search
@router.get("/api/v1/protocols", response_model=PaginatedResponse[ProtocolListItem])
async def list_all_protocols(
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Lists all protocols across all companies with pagination and optional search by protocol name/drug/therapeutic area.
    """
    pipeline = [
        {"$unwind": "$protocols"},
    ]
    
    protocol_match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        protocol_match_criteria["$or"] = [
            {"protocols.protocolName": search_regex},
            {"protocols.drugName": search_regex},
            {"protocols.therapeuticArea": search_regex},
        ]
    if protocol_match_criteria:
        pipeline.append({"$match": protocol_match_criteria})

    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        # Project full protocol fields to match Protocol model
        # NOTE: This projection currently yields ProtocolListItem. If you want full Protocol model,
        # you need a different projection and response_model=PaginatedResponse[Protocol]
        {"$project": {"_id":0, "protocolId":"$protocols.protocolId", "protocolName":"$protocols.protocolName"}}
    ])
    
    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }


# Get a single protocol by ID
@router.get("/api/v1/protocols/{protocol_id}", response_model=Protocol)
async def get_protocol(protocol_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    # Retrieves full details for a specific protocol by its ID.
    # Fetch the parent company document that contains this protocol, then extract the protocol.
    # This is often safer for complex nested structures than pure aggregation $project to root.
    company_doc = await db[COMPANY_COL].find_one(
        {"protocols.protocolId": protocol_id},
        {"_id": 0, "protocols.$": 1} # Project only the matching protocol from the array
    )
    if not company_doc or not company_doc.get("protocols"):
        raise HTTPException(status_code=404, detail="Protocol not found")
    
    protocol_doc = company_doc["protocols"][0] # Get the extracted protocol
    
    try:
        return Protocol(**protocol_doc) # Validate against the full Protocol model
    except Exception as e:
        logger.error(f"Error validating protocol {protocol_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing protocol data (validation error). Check data consistency.")


# List sites for a protocol with pagination and optional search
@router.get("/api/v1/protocols/{protocol_id}/sites", response_model=PaginatedResponse[SiteDashboardItem])
async def list_sites_for_protocol(
    protocol_id: str,
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    # Lists all sites associated with a specific protocol with pagination and optional search by site name/city/country.
    protocol_exists_count = await db[COMPANY_COL].count_documents({"protocols.protocolId": protocol_id})
    if protocol_exists_count == 0:
        raise HTTPException(status_code=404, detail="Protocol not found")

    pipeline = [
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols"},
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols.sites"},
    ]

    site_match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        site_match_criteria["$or"] = [
            {"protocols.sites.siteName": search_regex},
            {"protocols.sites.city": search_regex},
            {"protocols.sites.country": search_regex}
        ]
    if site_match_criteria:
        pipeline.append({"$match": site_match_criteria})

    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        {"$project": { # Project to SiteDashboardItem
            "_id": 0,
            "siteId": "$protocols.sites.siteId",
            "siteName": "$protocols.sites.siteName",
            "country": "$protocols.sites.country",
            "location": {"lat": "$protocols.sites.latitude", "lng": "$protocols.sites.longitude"},
            "sitePerformanceSummary": {
                "totalTrialsDone":           "$protocols.sites.sitePerformance.totalTrialsDone",
                "trialSuccessRate":          "$protocols.sites.sitePerformance.trialSuccessRate",
                "totalSubjectsEnrolledCount":"$protocols.sites.sitePerformance.totalSubjectsEnrolledCount",
                "subjectSuccessRate":        "$protocols.sites.sitePerformance.subjectSuccessRate",
                "enrollmentRatePerTrial":    "$protocols.sites.sitePerformance.enrollmentRatePerTrial",
                "dropoutRatePerTrial":       "$protocols.sites.sitePerformance.dropoutRatePerTrial"
            }
        }}
    ])
    
    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

# List all sites with pagination and optional search
@router.get("/api/v1/sites", response_model=PaginatedResponse[SiteDashboardItem])
async def list_all_sites(
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Lists all sites across all protocols and companies with pagination and optional search by site name/city/country.
    """
    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
    ]

    site_match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        site_match_criteria["$or"] = [
            {"protocols.sites.siteName": search_regex},
            {"protocols.sites.city": search_regex},
            {"protocols.sites.country": search_regex},
        ]
    if site_match_criteria:
        pipeline.append({"$match": site_match_criteria})

    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        {"$project": { # Project to SiteDashboardItem
            "_id": 0,
            "siteId": "$protocols.sites.siteId",
            "siteName": "$protocols.sites.siteName",
            "country": "$protocols.sites.country",
            "location": {"lat": "$protocols.sites.latitude", "lng": "$protocols.sites.longitude"},
            "sitePerformanceSummary": {
                "totalTrialsDone":           "$protocols.sites.sitePerformance.totalTrialsDone",
                "trialSuccessRate":          "$protocols.sites.sitePerformance.trialSuccessRate",
                "totalSubjectsEnrolledCount":"$protocols.sites.sitePerformance.totalSubjectsEnrolledCount",
                "subjectSuccessRate":        "$protocols.sites.sitePerformance.subjectSuccessRate",
                "enrollmentRatePerTrial":    "$protocols.sites.sitePerformance.enrollmentRatePerTrial",
                "dropoutRatePerTrial":       "$protocols.sites.sitePerformance.dropoutRatePerTrial"
            }
        }}
    ])
    
    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

# Get a single site by ID
@router.get("/api/v1/sites/{site_id}", response_model=Site)
async def get_site(site_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    """Retrieves full details for a specific site by its ID."""
    # Similar to get_protocol, find the parent protocol/company and then extract.
    # Aggregation to extract deeply nested full document can be complex,
    # often involves $unwind until the desired level and then $match and $limit 1
    # For a full Site model, we need to ensure all its nested fields (like subjects) are included.
    pipeline = [
        {"$match": {"protocols.sites.siteId": site_id}}, # Find document containing the site
        {"$unwind": "$protocols"}, # Unwind protocols
        {"$unwind": "$protocols.sites"}, # Unwind sites
        {"$match": {"protocols.sites.siteId": site_id}}, # Match the specific site after unwinding
        {"$replaceRoot": {"newRoot": "$protocols.sites"}} # Promote the matched site to root
        # If Site model contains Protocol/Company context, you would project them here before replaceRoot
    ]
    site_doc = await db[COMPANY_COL].aggregate(pipeline).to_list(length=1)
    if not site_doc:
        raise HTTPException(status_code=404, detail="Site not found")
    
    try:
        return Site(**site_doc[0])
    except Exception as e:
        logger.error(f"Error validating site {site_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing site data (validation error). Check data consistency.")