from pydantic import BaseModel
from typing	import List
from models.protocol import Protocol

class Financials(BaseModel):
    revenueUSD:       int
    rdExpenditureUSD: int
    marketCapUSD:     int

class PipelineSummary(BaseModel):
    phase1Count: int
    phase2Count: int
    phase3Count: int

class Company(BaseModel):
    companyId:                  str
    companyName:                str
    sponsorType:                str
    financials:                 Financials
    pipelineSummary:            PipelineSummary
    activeRegions:              List[str]
    therapeuticAreasCovered:    List[str]
    complianceScore:            float
    riskLevel:                  str
    website:                    str
    foundedYear:                int
    trialsRan:                  int
    successRatio:               float
    avgTrialCompletionTime:     int
    totalSubjectsHandled:       int
    protocols:                  List[Protocol]
