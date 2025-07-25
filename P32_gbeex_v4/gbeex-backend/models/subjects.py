# gbeex-backend/models/subjects.py
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class VitalSigns(BaseModel):
    bloodPressure: str
    heartRate: int

class EmergencyContact(BaseModel):
    name: str
    relation: str
    phone: str

class Subject(BaseModel):
    subjectId: str
    screeningNumber: str
    medicalRecordNumber: str
    dateOfConsent: str
    dateOfEnrollment: str
    randomizationDate: str
    treatmentArm: str
    age: int
    dateOfBirth: str
    gender: str
    ethnicity: str
    heightCm: int
    weightKg: int
    BMI: float
    bloodType: str
    smokingStatus: str
    alcoholConsumption: str
    drugUse: str
    comorbidities: List[str]
    priorMedications: List[str]
    familyHistory: List[str]
    allergies: List[str]
    dietaryRestrictions: str
    geneticMarkers: str
    visitCount: int
    lastVisitDate: str
    nextScheduledVisit: str
    status: str
    finalStatus: str
    dateOfLastContact: str
    previousTrial: bool 
    progressStatus: str
    protocolDeviation: bool 
    discontinuationReason: Optional[str] = None
    dropoutReason: Optional[str] = None
    vaccinationStatus: bool 
    socioeconomicStatus: str
    incomeBracket: str
    educationLevel: str
    adherenceScore: float
    medicationAdherence: float
    complications: str
    vitalSigns: VitalSigns
    qualityOfLifeScores: float
    studyDrugDosage: str
    insuranceProvider: str
    emergencyContact: EmergencyContact
    
    siteId: Optional[str] = None
    siteName: Optional[str] = None
    protocolId: Optional[str] = None
    protocolName: Optional[str] = None
    companyId: Optional[str] = None
    companyName: Optional[str] = None