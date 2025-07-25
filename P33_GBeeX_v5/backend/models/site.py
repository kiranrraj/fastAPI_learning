from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
from models.subject import Subject

class TimelineDelays(BaseModel):
    expectedCompletionDate: datetime
    actualCompletionDate:   datetime
    delayReason:            str

class SitePerformance(BaseModel):
    totalTrialsDone:             int
    trialSuccessRate:            float
    totalSubjectsEnrolledCount:  int
    subjectSuccessRate:          float
    enrollmentRatePerTrial:      float
    dropoutRatePerTrial:         float
    queryResolutionTime:         str
    protocolDeviationRate:       float
    complicationRate:            float

class SiteMetrics(BaseModel):
    screenFailureRate:    float
    avgTimeToContract:    str
    avgTimeToIRBApproval: str

class Investigator(BaseModel):
    name:        str
    credentials: str
    email:       str

class ContactInfo(BaseModel):
    name:  str
    email: str
    phone: str

class Site(BaseModel):
    siteId:                str
    siteName:              str
    siteType:              str
    country:               str
    state:                 str
    city:                  str
    latitude:              float
    longitude:             float
    principalInvestigator: Investigator
    investigatorExperience: int
    contactInfo:           ContactInfo
    siteActivationDate:    datetime
    recruitmentCapacity:   int
    infrastructureScore:   float
    sitePerformance:       SitePerformance
    siteMetrics:           SiteMetrics
    auditHistory:          List[datetime]
    performanceTrends:     str
    timelineDelays:        TimelineDelays
    IRBInfo:               Dict[str, str]
    patientRecruitmentSources: List[str]
    equipment:             List[str]
    staffCount:            Dict[str, int]
    monitoringVisits:      int
    financials:            Dict[str, int]
    subjects:              List[Subject]
