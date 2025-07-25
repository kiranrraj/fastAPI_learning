from pydantic import BaseModel
from typing import List
from datetime import datetime
from models.site import Site

class ProgressMetrics(BaseModel):
    enrolled:             int
    screened:             int
    completed:            int
    dropped:              int
    completionPercentage: float

class TimelineDelays(BaseModel):
    expectedCompletionDate: datetime
    actualCompletionDate:   datetime
    delayReason:            str

class EthicsApproval(BaseModel):
    committeeName: str
    approvalDate:  datetime
    approvalId:    str

class Protocol(BaseModel):
    protocolId:                  str
    protocolName:                str
    nctId:                       str
    drugName:                    str
    therapeuticArea:             str
    phase:                       str
    status:                      str
    studyDesign:                 str
    principalInvestigator:       str
    coordinatingCenter:          str
    budgetUSD:                   int
    startDate:                   datetime
    expectedEndDate:             datetime
    actualEndDate:               datetime
    estimatedEnrollmentSite:     int
    requiredSiteEnrollment:      int
    estimatedEnrollmentSubject:  int
    requiredSubjectEnrollment:   int
    protocolVersion:             str
    lastUpdatePosted:            datetime
    timelineDelays:              TimelineDelays
    progressMetrics:             ProgressMetrics
    dataMonitoringCommittee:     str
    ethicsCommitteeApproval:     EthicsApproval
    regulatorySubmissions:       List[str]
    patientReportedOutcomes:     str
    sites:                       List[Site]
