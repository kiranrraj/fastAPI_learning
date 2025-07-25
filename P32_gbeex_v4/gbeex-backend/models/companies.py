# models/companies.py
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from models.subjects import Subject, VitalSigns, EmergencyContact 

# Remove later if not needed
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

# Full Detail Models
# Nested model for Principal Investigator
class PrincipalInvestigator(BaseModel):
    name: str
    credentials: str
    email: str

# Nested model for Contact Info
class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str

# Nested model for Site Performance 
class SiteFullPerformance(BaseModel):
    totalTrialsDone: int
    trialSuccessRate: float
    totalSubjectsEnrolledCount: int
    subjectSuccessRate: float
    enrollmentRatePerTrial: float
    dropoutRatePerTrial: float
    queryResolutionTime: str
    protocolDeviationRate: float
    complicationRate: float

# Nested model for Site Metrics
class SiteMetrics(BaseModel):
    screenFailureRate: float
    avgTimeToContract: str
    avgTimeToIRBApproval: str

# Nested model for IRB Info
class IRBInfo(BaseModel):
    name: str
    registrationNumber: str
    contactEmail: str

# Nested model for Staff Count
class StaffCount(BaseModel):
    doctor: int
    technician: int

# Nested model for Financials 
class SiteFinancials(BaseModel):
    contractValueUSD: int
    paymentsMadeUSD: int

# Full Site Model 
class Site(BaseModel):
    siteId: str
    siteName: str
    siteType: str
    country: str
    state: str
    city: str
    latitude: float
    longitude: float
    principalInvestigator: PrincipalInvestigator
    investigatorExperience: int
    contactInfo: ContactInfo
    siteActivationDate: str 
    recruitmentCapacity: int
    infrastructureScore: float
    sitePerformance: SiteFullPerformance
    siteMetrics: SiteMetrics
    auditHistory: List[str] 
    performanceTrends: str
    timelineDelays: Dict[str, Any] 
    IRBInfo: IRBInfo
    patientRecruitmentSources: List[str]
    equipment: List[str]
    staffCount: StaffCount
    monitoringVisits: int
    financials: SiteFinancials
    subjects: List[Subject] 

# Nested model for Progress Metrics
class ProgressMetrics(BaseModel):
    enrolled: int
    screened: int
    completed: int
    dropped: int
    completionPercentage: float

# Nested model for Ethics Committee Approval
class EthicsCommitteeApproval(BaseModel):
    committeeName: str
    approvalDate: str 
    approvalId: str

# Full Protocol Model 
class Protocol(BaseModel):
    protocolId: str
    protocolName: str
    nctId: str
    drugName: str
    therapeuticArea: str
    phase: str
    status: str
    studyDesign: str
    principalInvestigator: str 
    coordinatingCenter: str
    budgetUSD: int
    startDate: str 
    expectedEndDate: str 
    actualEndDate: str 
    estimatedEnrollmentSite: int
    requiredSiteEnrollment: int
    estimatedEnrollmentSubject: int
    requiredSubjectEnrollment: int
    protocolVersion: str
    lastUpdatePosted: str 
    timelineDelays: Dict[str, Any]
    progressMetrics: ProgressMetrics
    dataMonitoringCommittee: str
    ethicsCommitteeApproval: EthicsCommitteeApproval
    regulatorySubmissions: List[str]
    patientReportedOutcomes: str
    sites: List[Site] 

# Nested model for Financials (Company level)
class CompanyFinancials(BaseModel):
    revenueUSD: int
    rdExpenditureUSD: int
    marketCapUSD: int

# Nested model for Pipeline Summary
class PipelineSummary(BaseModel):
    phase1Count: int
    phase2Count: int
    phase3Count: int

class Company(BaseModel):
    companyId: str
    companyName: str
    sponsorType: str
    financials: CompanyFinancials
    pipelineSummary: PipelineSummary
    activeRegions: List[str]
    therapeuticAreasCovered: List[str]
    complianceScore: float
    riskLevel: str
    website: str
    foundedYear: int
    trialsRan: int
    successRatio: float
    avgTrialCompletionTime: int
    totalSubjectsHandled: int
    protocols: List[Protocol] 