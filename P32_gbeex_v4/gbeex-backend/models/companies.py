# models/companies.py
from typing import List, Optional
from pydantic import BaseModel

class CompanyListItem(BaseModel):
    companyId: str
    companyName: str

class ProtocolListItem(BaseModel):
    protocolId: str
    protocolName: str

class SiteLocation(BaseModel):
    lat: float
    lng: float

class SitePerformanceSummary(BaseModel):
    totalTrialsDone: int
    trialSuccessRate: float
    totalSubjectsEnrolledCount: int
    subjectSuccessRate: float
    enrollmentRatePerTrial: float
    dropoutRatePerTrial: float

class SiteDashboardItem(BaseModel):
    siteId: str
    siteName: str
    country: str
    location: SiteLocation
    sitePerformanceSummary: SitePerformanceSummary