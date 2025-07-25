from fastapi import APIRouter, Query
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json

from models.company import Company
from models.protocol import Protocol
from models.site import Site
from models.subject import Subject

router = APIRouter(prefix="/v1/search", tags=["Search Data"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "GBeeXDataV4"
CLIENT = AsyncIOMotorClient(MONGO_URI)
DB = CLIENT[DB_NAME]
COL = DB["clientData"]

class PageEnvelope(BaseModel):
    items:    List[Any]
    page:     int
    per_page: int
    total:    int

def strip_object_ids(obj: Any):
    if isinstance(obj, dict):
        obj.pop("_id", None)
        for v in obj.values():
            strip_object_ids(v)
    elif isinstance(obj, list):
        for item in obj:
            strip_object_ids(item)

def pick_fields_from_item(item: dict, fields: List[str]) -> dict:
    out = {}
    for path in fields:
        cur = item
        for part in path.split("."):
            if isinstance(cur, dict) and part in cur:
                cur = cur[part]
            else:
                cur = None
                break
        if cur is not None:
            out[path] = cur
    return out


@router.get("/company", response_model=PageEnvelope)
async def search_companies(
    q: Optional[str]           = None,
    companyName: Optional[str] = None,
    sponsorType: Optional[str] = None,
    riskLevel: Optional[str]   = None,
    fields: Optional[str]= Query(None, description="list of fields to include"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str]  = Query("asc")
):
    skip, limit = (page - 1) * per_page, per_page

    filt: Dict[str, Any] = {}
    if q:
        filt["$or"] = [
            {"companyName": {"$regex": q, "$options": "i"}},
            {"website": {"$regex": q, "$options": "i"}}
        ]
    if companyName:
        filt["companyName"] = {"$regex": companyName, "$options": "i"}
    if sponsorType:
        filt["sponsorType"] = sponsorType
    if riskLevel:
        filt["riskLevel"] = riskLevel

    total = await COL.count_documents(filt)
    cursor = COL.find(filt)
    if sort_by:
        direction = 1 if sort_order == "asc" else -1
        cursor = cursor.sort(sort_by, direction)

    raw_docs = await cursor.skip(skip).limit(limit).to_list(length=limit)

    print(f"DEBUG /company: Page {page}, Skip {skip}, Limit {limit}, Raw Docs Count: {len(raw_docs)}, Total: {total}")
    # print(f"DEBUG /company: Raw Docs: {json.dumps(raw_docs, default=str, indent=2)}")

    for d in raw_docs:
        strip_object_ids(d)

    requested = [f.strip() for f in fields.split(",")] if fields else None
    items = []
    for d in raw_docs:
        company = Company(**d).model_dump()
        items.append(pick_fields_from_item(company, requested) if requested else company)

    return PageEnvelope(items=items, page=page, per_page=per_page, total=total)


@router.get("/protocol", response_model=PageEnvelope)
async def search_protocols(
    q: Optional[str] = None,
    protocolName: Optional[str] = None,
    phase: Optional[str] = None,
    status: Optional[str] = None,
    companyId: Optional[str] = None,
    fields: Optional[str] = Query(None, description="list of fields to include"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[str] = Query("asc")
):
    skip, limit = (page - 1) * per_page, per_page

    pipeline = [{"$unwind": "$protocols"}]
    match: Dict[str, Any] = {}
    if companyId:
        match["companyId"] = companyId
    
    q_filters = []
    if q:
        q_filters.append({"protocols.protocolName": {"$regex": q, "$options": "i"}})
        q_filters.append({"protocols.nctId": {"$regex": q, "$options": "i"}})
    if protocolName:
        q_filters.append({"protocols.protocolName": {"$regex": protocolName, "$options": "i"}})

    if q_filters:
        match["$and"] = q_filters

    if phase:
        match["protocols.phase"] = phase
    if status:
        match["protocols.status"] = status
    
    if match:
        pipeline.append({"$match": match})

    count_pipeline = list(pipeline)
    count_pipeline.append({"$count": "total_count"})
    total_result = await COL.aggregate(count_pipeline).to_list(length=1)
    total = total_result[0]["total_count"] if total_result else 0

    print(f"DEBUG /protocol: Page {page}, Per Page {per_page}, Skip {skip}, Limit {limit}")
    print(f"DEBUG /protocol: Total count reported: {total}")
    print(f"DEBUG /protocol: Aggregation match stage: {json.dumps(match, default=str, indent=2)}")
    
    data_pipeline = list(pipeline) 
    if sort_by:
        direction = 1 if sort_order == "asc" else -1
        data_pipeline.append({"$sort": {f"protocols.{sort_by}": direction}})
    data_pipeline.append({"$sort": {"protocols.protocolId": 1}}) 

    data_pipeline.extend([{"$skip": skip}, {"$limit": limit}])

    print(f"DEBUG /protocol: Full aggregation pipeline for data: {json.dumps(data_pipeline, default=str, indent=2)}")


    raw_docs = await COL.aggregate(data_pipeline).to_list(length=limit)
    print(f"DEBUG /protocol: Raw docs received for page {page}: {len(raw_docs)}")

    for d in raw_docs:
        strip_object_ids(d)

    requested = [f.strip() for f in fields.split(",")] if fields else None
    items = []
    for d in raw_docs:
        proto = Protocol(**d["protocols"]).model_dump()
        items.append(pick_fields_from_item(proto, requested) if requested else proto)

    return PageEnvelope(items=items, page=page, per_page=per_page, total=total)

@router.get("/site", response_model=PageEnvelope)
async def search_sites(
    q: Optional[str]        = None,
    siteName: Optional[str] = None,
    city: Optional[str]     = None,
    country: Optional[str]  = None,
    status: Optional[str]   = None,
    protocolId: Optional[str]= None,
    fields: Optional[str]    = Query(None, description="list of fields to include"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: Optional[str]   = Query(None),
    sort_order: Optional[str]= Query("asc")
):
    skip, limit = (page - 1) * per_page, per_page

    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"}
    ]
    match: Dict[str, Any] = {}
    if protocolId:
        match["protocols.sites.protocolId"] = protocolId
    
    q_filters = []
    if q:
        q_filters.append({"protocols.sites.siteName": {"$regex": q, "$options": "i"}})
        q_filters.append({"protocols.sites.city": {"$regex": q, "$options": "i"}})
    if siteName:
        q_filters.append({"protocols.sites.siteName": {"$regex": siteName, "$options": "i"}})

    if q_filters:
        match["$and"] = q_filters

    if city:
        match["protocols.sites.city"] = city
    if country:
        match["protocols.sites.country"] = country
    if status:
        match["protocols.sites.status"] = status
    if match:
        pipeline.append({"$match": match})

    # Calculate total count
    count_pipeline = list(pipeline)
    count_pipeline.append({"$count": "total_count"})
    total_result = await COL.aggregate(count_pipeline).to_list(length=1)
    total = total_result[0]["total_count"] if total_result else 0

    print(f"DEBUG /site: Page {page}, Per Page {per_page}, Skip {skip}, Limit {limit}")
    print(f"DEBUG /site: Total count reported: {total}")
    print(f"DEBUG /site: Aggregation match stage: {json.dumps(match, default=str, indent=2)}")
    
    data_pipeline = list(pipeline)
    if sort_by:
        direction = 1 if sort_order == "asc" else -1
        data_pipeline.append({"$sort": {f"protocols.sites.{sort_by}": direction}})
    data_pipeline.append({"$sort": {"protocols.sites.siteId": 1}})

    data_pipeline.extend([{"$skip": skip}, {"$limit": limit}])

    print(f"DEBUG /site: Full aggregation pipeline for data: {json.dumps(data_pipeline, default=str, indent=2)}")

    raw_docs = await COL.aggregate(data_pipeline).to_list(length=limit)

    print(f"DEBUG /site: Raw docs received for page {page}: {len(raw_docs)}")

    for d in raw_docs:
        strip_object_ids(d)

    requested = [f.strip() for f in fields.split(",")] if fields else None
    items = []
    for d in raw_docs:
        site = Site(**d["protocols"]["sites"]).model_dump()
        items.append(pick_fields_from_item(site, requested) if requested else site)

    return PageEnvelope(items=items, page=page, per_page=per_page, total=total)

@router.get("/subject", response_model=PageEnvelope)
async def search_subjects(
    q: Optional[str]= None,
    screeningNumber: Optional[str] = None,
    medicalRecordNumber: Optional[str] = None,
    status: Optional[str] = None,
    siteId: Optional[str]= None,
    fields: Optional[str] = Query(None, description="list of fields to include"),
    page: int = Query(1, ge=1),
    per_page: int  = Query(20, ge=1, le=100),
    sort_by: Optional[str]  = Query(None),
    sort_order: Optional[str] = Query("asc")
):
    skip, limit = (page - 1) * per_page, per_page

    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
        {"$unwind": "$protocols.sites.subjects"}
    ]
    match: Dict[str, Any] = {}
    if siteId:
        match["protocols.sites.siteId"] = siteId
    
    q_filters = []
    if q:
        q_filters.append({"protocols.sites.subjects.screeningNumber": {"$regex": q, "$options": "i"}})
        q_filters.append({"protocols.sites.subjects.medicalRecordNumber": {"$regex": q, "$options": "i"}})
    if screeningNumber:
        q_filters.append({"protocols.sites.subjects.screeningNumber": {"$regex": screeningNumber, "$options": "i"}})

    if q_filters:
        match["$and"] = q_filters

    if medicalRecordNumber:
        match["protocols.sites.subjects.medicalRecordNumber"] = medicalRecordNumber
    if status:
        match["protocols.sites.subjects.status"] = status
    if match:
        pipeline.append({"$match": match})

    count_pipeline = list(pipeline)
    count_pipeline.append({"$count": "total_count"})
    total_result = await COL.aggregate(count_pipeline).to_list(length=1)
    total = total_result[0]["total_count"] if total_result else 0

    print(f"DEBUG /subject: Page {page}, Per Page {per_page}, Skip {skip}, Limit {limit}")
    print(f"DEBUG /subject: Total count reported: {total}")
    print(f"DEBUG /subject: Aggregation match stage: {json.dumps(match, default=str, indent=2)}")
    
    data_pipeline = list(pipeline)
    if sort_by:
        direction = 1 if sort_order == "asc" else -1
        data_pipeline.append({"$sort": {f"protocols.sites.subjects.{sort_by}": direction}})
    data_pipeline.append({"$sort": {"protocols.sites.subjects.subjectId": 1}})

    data_pipeline.extend([{"$skip": skip}, {"$limit": limit}])
    print(f"DEBUG /subject: Full aggregation pipeline for data: {json.dumps(data_pipeline, default=str, indent=2)}")

    raw_docs = await COL.aggregate(data_pipeline).to_list(length=limit)
    print(f"DEBUG /subject: Raw docs received for page {page}: {len(raw_docs)}")

    requested = [f.strip() for f in fields.split(",")] if fields else None
    items = []
    for d in raw_docs:
        strip_object_ids(d)
        subj = d["protocols"]["sites"]["subjects"]
        for key in ("previousTrial","protocolDeviation","vaccinationStatus"):
            if isinstance(subj.get(key), bool):
                subj[key] = str(subj[key])
        validated = Subject(**subj).model_dump()
        items.append(pick_fields_from_item(validated, requested) if requested else validated)

    return PageEnvelope(items=items, page=page, per_page=per_page, total=total)