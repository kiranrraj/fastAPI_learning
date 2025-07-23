# routers/subjects.py
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.subjects import Subject 
from config import COMPANY_COL

router = APIRouter(tags=["Subjects"])
logger = logging.getLogger(__name__)

@router.get(
    "/api/v1/subjects/search",
    response_model=List[Subject],
    summary="Search for subjects",
)
async def search_subjects(
    search_term: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    gender: Optional[str] = None,
    status: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Searches for subjects across all companies, protocols, and sites.
    Results can be filtered by a general search term (screening number, MRN, subject ID)
    or specific criteria like age, gender, and status.
    """
    pipeline = [
        {"$unwind": "$protocols"},
        {"$unwind": "$protocols.sites"},
        {"$unwind": "$protocols.sites.subjects"},
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

    match_criteria = {}
    if search_term:
        search_regex = {"$regex": search_term, "$options": "i"}
        match_criteria["$or"] = [
            {"subjectId": search_regex},
            {"screeningNumber": search_regex},
            {"medicalRecordNumber": search_regex}
        ]
    
    if min_age is not None:
        match_criteria["age"] = {"$gte": min_age}
    if max_age is not None:
        match_criteria.setdefault("age", {})["$lte"] = max_age
    if gender:
        match_criteria["gender"] = gender
    if status:
        match_criteria["status"] = status

    if match_criteria:
        pipeline.append({"$match": match_criteria})

    try:
        subjects = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
        return subjects
    except Exception as e:
        logger.error("Error searching subjects: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to perform subject search"
        )