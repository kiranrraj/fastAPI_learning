# gbeex-backend/routers/subjects.py
import logging
from typing import List, Optional
from math import ceil
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.subjects import Subject
from models.common import PaginatedResponse
from config import COMPANY_COL

router = APIRouter(tags=["Subjects"])
logger = logging.getLogger(__name__)

# Global search for subjects with pagination
@router.get(
    "/api/v1/subjects/search",
    response_model=PaginatedResponse[Subject],
    summary="Search for subjects",
)
async def search_subjects(
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    gender: Optional[str] = None,
    status: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    # Searches for subjects across all companies, protocols, and sites with pagination.
    # Results can be filtered by a general search term (screening number, MRN, subject ID)
    # or specific criteria like age, gender, and status.
    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
        {"$unwind": "$protocols.sites.subjects"},
    ]

    match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        match_criteria["$or"] = [
            {"protocols.sites.subjects.subjectId": search_regex},
            {"protocols.sites.subjects.screeningNumber": search_regex},
            {"protocols.sites.subjects.medicalRecordNumber": search_regex}
        ]
    
    if min_age is not None:
        match_criteria["protocols.sites.subjects.age"] = {"$gte": min_age}
    if max_age is not None:
        match_criteria.setdefault("protocols.sites.subjects.age", {})["$lte"] = max_age
    if gender:
        match_criteria["protocols.sites.subjects.gender"] = gender
    if status:
        match_criteria["protocols.sites.subjects.status"] = status

    if match_criteria:
        pipeline.append({"$match": match_criteria})

    # Get total count (before pagination)
    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    # Apply pagination to the main pipeline
    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        {"$project": { # Project all subject fields and relevant context
            "_id": 0,
            "subjectId": "$protocols.sites.subjects.subjectId",
            "screeningNumber": "$protocols.sites.subjects.screeningNumber",
            "medicalRecordNumber": "$protocols.sites.subjects.medicalRecordNumber",
            "dateOfConsent": "$protocols.sites.subjects.dateOfConsent",
            "dateOfEnrollment": "$protocols.sites.subjects.dateOfEnrollment",
            "randomizationDate": "$protocols.sites.subjects.randomizationDate",
            "treatmentArm": "$protocols.sites.subjects.treatmentArm",
            "age": "$protocols.sites.subjects.age",
            "dateOfBirth": "$protocols.sites.subjects.dateOfBirth",
            "gender": "$protocols.sites.subjects.gender",
            "ethnicity": "$protocols.sites.subjects.ethnicity",
            "heightCm": "$protocols.sites.subjects.heightCm",
            "weightKg": "$protocols.sites.subjects.weightKg",
            "BMI": "$protocols.sites.subjects.BMI",
            "bloodType": "$protocols.sites.subjects.bloodType",
            "smokingStatus": "$protocols.sites.subjects.smokingStatus",
            "alcoholConsumption": "$protocols.sites.subjects.alcoholConsumption",
            "drugUse": "$protocols.sites.subjects.drugUse",
            "comorbidities": "$protocols.sites.subjects.comorbidities",
            "priorMedications": "$protocols.sites.subjects.priorMedications",
            "familyHistory": "$protocols.sites.subjects.familyHistory",
            "allergies": "$protocols.sites.subjects.allergies",
            "dietaryRestrictions": "$protocols.sites.subjects.dietaryRestrictions",
            "geneticMarkers": "$protocols.sites.subjects.geneticMarkers",
            "visitCount": "$protocols.sites.subjects.visitCount",
            "lastVisitDate": "$protocols.sites.subjects.lastVisitDate",
            "nextScheduledVisit": "$protocols.sites.subjects.nextScheduledVisit",
            "status": "$protocols.sites.subjects.status",
            "finalStatus": "$protocols.sites.subjects.finalStatus",
            "dateOfLastContact": "$protocols.sites.subjects.dateOfLastContact",
            "previousTrial": "$protocols.sites.subjects.previousTrial",
            "progressStatus": "$protocols.sites.subjects.progressStatus",
            "protocolDeviation": "$protocols.sites.subjects.protocolDeviation",
            "discontinuationReason": "$protocols.sites.subjects.discontinuationReason",
            "dropoutReason": "$protocols.sites.subjects.dropoutReason",
            "vaccinationStatus": "$protocols.sites.subjects.vaccinationStatus",
            "socioeconomicStatus": "$protocols.sites.subjects.socioeconomicStatus",
            "incomeBracket": "$protocols.sites.subjects.incomeBracket",
            "educationLevel": "$protocols.sites.subjects.educationLevel",
            "adherenceScore": "$protocols.sites.subjects.adherenceScore",
            "medicationAdherence": "$protocols.sites.subjects.medicationAdherence",
            "complications": "$protocols.sites.subjects.complications",
            "vitalSigns": "$protocols.sites.subjects.vitalSigns",
            "qualityOfLifeScores": "$protocols.sites.subjects.qualityOfLifeScores",
            "studyDrugDosage": "$protocols.sites.subjects.studyDrugDosage",
            "insuranceProvider": "$protocols.sites.subjects.insuranceProvider",
            "emergencyContact": "$protocols.sites.subjects.emergencyContact",
            
            "siteId": "$protocols.sites.siteId",
            "siteName": "$protocols.sites.siteName",
            "protocolId": "$protocols.protocolId",
            "protocolName": "$protocols.protocolName",
            "companyId": "$companyId",
            "companyName": "$companyName"
        }}
    ])

    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }

# Get a single subject by ID
@router.get("/api/v1/subjects/{subject_id}", response_model=Subject)
async def get_subject(subject_id: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    """Retrieves full details for a specific subject by their ID."""
    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
        {"$unwind": "$protocols.sites.subjects"},
        {"$match": {"protocols.sites.subjects.subjectId": subject_id}},
        {"$project": {
            "_id": 0,
            "subjectId": "$protocols.sites.subjects.subjectId",
            "screeningNumber": "$protocols.sites.subjects.screeningNumber",
            "medicalRecordNumber": "$protocols.sites.subjects.medicalRecordNumber",
            "dateOfConsent": "$protocols.sites.subjects.dateOfConsent",
            "dateOfEnrollment": "$protocols.sites.subjects.dateOfEnrollment",
            "randomizationDate": "$protocols.sites.subjects.randomizationDate",
            "treatmentArm": "$protocols.sites.subjects.treatmentArm",
            "age": "$protocols.sites.subjects.age",
            "dateOfBirth": "$protocols.sites.subjects.dateOfBirth",
            "gender": "$protocols.sites.subjects.gender",
            "ethnicity": "$protocols.sites.subjects.ethnicity",
            "heightCm": "$protocols.sites.subjects.heightCm",
            "weightKg": "$protocols.sites.subjects.weightKg",
            "BMI": "$protocols.sites.subjects.BMI",
            "bloodType": "$protocols.sites.subjects.bloodType",
            "smokingStatus": "$protocols.sites.subjects.smokingStatus",
            "alcoholConsumption": "$protocols.sites.subjects.alcoholConsumption",
            "drugUse": "$protocols.sites.subjects.drugUse",
            "comorbidities": "$protocols.sites.subjects.comorbidities",
            "priorMedications": "$protocols.sites.subjects.priorMedications",
            "familyHistory": "$protocols.sites.subjects.familyHistory",
            "allergies": "$protocols.sites.subjects.allergies",
            "dietaryRestrictions": "$protocols.sites.subjects.dietaryRestrictions",
            "geneticMarkers": "$protocols.sites.subjects.geneticMarkers",
            "visitCount": "$protocols.sites.subjects.visitCount",
            "lastVisitDate": "$protocols.sites.subjects.lastVisitDate",
            "nextScheduledVisit": "$protocols.sites.subjects.nextScheduledVisit",
            "status": "$protocols.sites.subjects.status",
            "finalStatus": "$protocols.sites.subjects.finalStatus",
            "dateOfLastContact": "$protocols.sites.subjects.dateOfLastContact",
            "previousTrial": "$protocols.sites.subjects.previousTrial",
            "progressStatus": "$protocols.sites.subjects.progressStatus",
            "protocolDeviation": "$protocols.sites.subjects.protocolDeviation",
            "discontinuationReason": "$protocols.sites.subjects.discontinuationReason",
            "dropoutReason": "$protocols.sites.subjects.dropoutReason",
            "vaccinationStatus": "$protocols.sites.subjects.vaccinationStatus",
            "socioeconomicStatus": "$protocols.sites.subjects.socioeconomicStatus",
            "incomeBracket": "$protocols.sites.subjects.incomeBracket",
            "educationLevel": "$protocols.sites.subjects.educationLevel",
            "adherenceScore": "$protocols.sites.subjects.adherenceScore",
            "medicationAdherence": "$protocols.sites.subjects.medicationAdherence",
            "complications": "$protocols.sites.subjects.complications",
            "vitalSigns": "$protocols.sites.subjects.vitalSigns",
            "qualityOfLifeScores": "$protocols.sites.subjects.qualityOfLifeScores",
            "studyDrugDosage": "$protocols.sites.subjects.studyDrugDosage",
            "insuranceProvider": "$protocols.sites.subjects.insuranceProvider",
            "emergencyContact": "$protocols.sites.subjects.emergencyContact",
            
            "siteId": "$protocols.sites.siteId",
            "siteName": "$protocols.sites.siteName",
            "protocolId": "$protocols.protocolId",
            "protocolName": "$protocols.protocolName",
            "companyId": "$companyId",
            "companyName": "$companyName"
        }}
    ]
    subject_doc = await db[COMPANY_COL].aggregate(pipeline).to_list(length=1)
    if not subject_doc:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    try:
        return Subject(**subject_doc[0])
    except Exception as e:
        logger.error(f"Error validating subject {subject_id}: {e}")
        raise HTTPException(status_code=500, detail="Error processing subject data")


# List subjects for a specific site with pagination
@router.get("/api/v1/sites/{site_id}/subjects", response_model=PaginatedResponse[Subject]) # NEW response_model
async def list_subjects_for_site(
    site_id: str,
    page: int = 1,
    limit: int = 10,
    search_term: Optional[str] = None, 
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    gender: Optional[str] = None,
    status: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Retrieves all subjects associated with a specific site with pagination and search/filters.
    """
    # First, verify the site exists within any protocol
    site_exists_count = await db[COMPANY_COL].count_documents({"protocols.sites.siteId": site_id})
    if site_exists_count == 0:
        raise HTTPException(status_code=404, detail="Site not found")

    # Aggregation pipeline for subjects within a site
    pipeline = [
        {"$match": {"protocols.sites.siteId": site_id}},
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
        {"$match": {"protocols.sites.siteId": site_id}}, 
        {"$unwind": "$protocols.sites.subjects"},
    ]

    subject_match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        subject_match_criteria["$or"] = [
            {"protocols.sites.subjects.subjectId": search_regex},
            {"protocols.sites.subjects.screeningNumber": search_regex},
            {"protocols.sites.subjects.medicalRecordNumber": search_regex}
        ]
    if min_age is not None:
        subject_match_criteria["protocols.sites.subjects.age"] = {"$gte": min_age}
    if max_age is not None:
        subject_match_criteria.setdefault("protocols.sites.subjects.age", {})["$lte"] = max_age
    if gender:
        subject_match_criteria["protocols.sites.subjects.gender"] = gender
    if status:
        subject_match_criteria["protocols.sites.subjects.status"] = status

    if subject_match_criteria:
        pipeline.append({"$match": subject_match_criteria})

    # Get total count (before pagination)
    total_count_pipeline = pipeline + [{"$count": "total"}]
    total_result = await db[COMPANY_COL].aggregate(total_count_pipeline).to_list(length=1)
    total_count = total_result[0]["total"] if total_result else 0

    # Apply pagination to the main pipeline
    skip = (page - 1) * limit
    pipeline.extend([
        {"$skip": skip},
        {"$limit": limit},
        {"$project": { # Project all subject fields and relevant context
            "_id": 0,
            "subjectId": "$protocols.sites.subjects.subjectId",
            "screeningNumber": "$protocols.sites.subjects.screeningNumber",
            "medicalRecordNumber": "$protocols.sites.subjects.medicalRecordNumber",
            "dateOfConsent": "$protocols.sites.subjects.dateOfConsent",
            "dateOfEnrollment": "$protocols.sites.subjects.dateOfEnrollment",
            "randomizationDate": "$protocols.sites.subjects.randomizationDate",
            "treatmentArm": "$protocols.sites.subjects.treatmentArm",
            "age": "$protocols.sites.subjects.age",
            "dateOfBirth": "$protocols.sites.subjects.dateOfBirth",
            "gender": "$protocols.sites.subjects.gender",
            "ethnicity": "$protocols.sites.subjects.ethnicity",
            "heightCm": "$protocols.sites.subjects.heightCm",
            "weightKg": "$protocols.sites.subjects.weightKg",
            "BMI": "$protocols.sites.subjects.BMI",
            "bloodType": "$protocols.sites.subjects.bloodType",
            "smokingStatus": "$protocols.sites.subjects.smokingStatus",
            "alcoholConsumption": "$protocols.sites.subjects.alcoholConsumption",
            "drugUse": "$protocols.sites.subjects.drugUse",
            "comorbidities": "$protocols.sites.subjects.comorbidities",
            "priorMedications": "$protocols.sites.subjects.priorMedications",
            "familyHistory": "$protocols.sites.subjects.familyHistory",
            "allergies": "$protocols.sites.subjects.allergies",
            "dietaryRestrictions": "$protocols.sites.subjects.dietaryRestrictions",
            "geneticMarkers": "$protocols.sites.subjects.geneticMarkers",
            "visitCount": "$protocols.sites.subjects.visitCount",
            "lastVisitDate": "$protocols.sites.subjects.lastVisitDate",
            "nextScheduledVisit": "$protocols.sites.subjects.nextScheduledVisit",
            "status": "$protocols.sites.subjects.status",
            "finalStatus": "$protocols.sites.subjects.finalStatus",
            "dateOfLastContact": "$protocols.sites.subjects.dateOfLastContact",
            "previousTrial": "$protocols.sites.subjects.previousTrial",
            "progressStatus": "$protocols.sites.subjects.progressStatus",
            "protocolDeviation": "$protocols.sites.subjects.protocolDeviation",
            "discontinuationReason": "$protocols.sites.subjects.discontinuationReason",
            "dropoutReason": "$protocols.sites.subjects.dropoutReason",
            "vaccinationStatus": "$protocols.sites.subjects.vaccinationStatus",
            "socioeconomicStatus": "$protocols.sites.subjects.socioeconomicStatus",
            "incomeBracket": "$protocols.sites.subjects.incomeBracket",
            "educationLevel": "$protocols.sites.subjects.educationLevel",
            "adherenceScore": "$protocols.sites.subjects.adherenceScore",
            "medicationAdherence": "$protocols.sites.subjects.medicationAdherence",
            "complications": "$protocols.sites.subjects.complications",
            "vitalSigns": "$protocols.sites.subjects.vitalSigns",
            "qualityOfLifeScores": "$protocols.sites.subjects.qualityOfLifeScores",
            "studyDrugDosage": "$protocols.sites.subjects.studyDrugDosage",
            "insuranceProvider": "$protocols.sites.subjects.insuranceProvider",
            "emergencyContact": "$protocols.sites.subjects.emergencyContact",
            
            "siteId": "$protocols.sites.siteId",
            "siteName": "$protocols.sites.siteName",
            "protocolId": "$protocols.protocolId",
            "protocolName": "$protocols.protocolName",
            "companyId": "$companyId",
            "companyName": "$companyName"
        }}
    ])
    
    items = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    
    return {
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }