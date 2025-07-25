// app/types/companies.ts

import type { Subject, VitalSigns, EmergencyContact } from '@/app/types/subjects';
export interface CompanyListItem {
    companyId: string;
    companyName: string;
}

export interface ProtocolListItem {
    protocolId: string;
    protocolName: string;
}

export interface SiteLocation {
    lat: number;
    lng: number;
}

export interface SitePerformanceSummary {
    totalTrialsDone: number;
    trialSuccessRate: number;
    totalSubjectsEnrolledCount: number;
    subjectSuccessRate: number;
    enrollmentRatePerTrial: number;
    dropoutRatePerTrial: number;
}

export interface SiteDashboardItem {
    siteId: string;
    siteName: string;
    country: string;
    location: SiteLocation;
    sitePerformanceSummary: SitePerformanceSummary;
}


// Full Detail Types

// Principal Investigator
export interface PrincipalInvestigator {
    name: string;
    credentials: string;
    email: string;
}

// Contact Info
export interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

// Site Performance 
export interface SiteFullPerformance {
    totalTrialsDone: number;
    trialSuccessRate: number;
    totalSubjectsEnrolledCount: number;
    subjectSuccessRate: number;
    enrollmentRatePerTrial: number;
    dropoutRatePerTrial: number;
    queryResolutionTime: string;
    protocolDeviationRate: number;
    complicationRate: number;
}

// Site Metrics
export interface SiteMetrics {
    screenFailureRate: number;
    avgTimeToContract: string;
    avgTimeToIRBApproval: string;
}

// IRB Info
export interface IRBInfo {
    name: string;
    registrationNumber: string;
    contactEmail: string;
}

// Staff Count
export interface StaffCount {
    doctor: number;
    technician: number;
}

// Financials (Site level)
export interface SiteFinancials {
    contractValueUSD: number;
    paymentsMadeUSD: number;
}

// Full Site Interface 
export interface Site {
    siteId: string;
    siteName: string;
    siteType: string;
    country: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    principalInvestigator: PrincipalInvestigator;
    investigatorExperience: number;
    contactInfo: ContactInfo;
    siteActivationDate: string;
    recruitmentCapacity: number;
    infrastructureScore: number;
    sitePerformance: SiteFullPerformance;
    siteMetrics: SiteMetrics;
    auditHistory: string[];
    performanceTrends: string;
    timelineDelays: Record<string, any>;
    IRBInfo: IRBInfo;
    patientRecruitmentSources: string[];
    equipment: string[];
    staffCount: StaffCount;
    monitoringVisits: number;
    financials: SiteFinancials;
    subjects: Subject[];
}

// Progress Metrics
export interface ProgressMetrics {
    enrolled: number;
    screened: number;
    completed: number;
    dropped: number;
    completionPercentage: number;
}

// Ethics Committee Approval
export interface EthicsCommitteeApproval {
    committeeName: string;
    approvalDate: string;
    approvalId: string;
}

// Full Protocol Interface 
export interface Protocol {
    protocolId: string;
    protocolName: string;
    nctId: string;
    drugName: string;
    therapeuticArea: string;
    phase: string;
    status: string;
    studyDesign: string;
    principalInvestigator: string;
    coordinatingCenter: string;
    budgetUSD: number;
    startDate: string;
    expectedEndDate: string;
    actualEndDate: string;
    estimatedEnrollmentSite: number;
    requiredSiteEnrollment: number;
    estimatedEnrollmentSubject: number;
    requiredSubjectEnrollment: number;
    protocolVersion: string;
    lastUpdatePosted: string;
    timelineDelays: Record<string, any>;
    progressMetrics: ProgressMetrics;
    dataMonitoringCommittee: string;
    ethicsCommitteeApproval: EthicsCommitteeApproval;
    regulatorySubmissions: string[];
    patientReportedOutcomes: string;
    sites: Site[];
}

// Nested interface for Financials 
export interface CompanyFinancials {
    revenueUSD: number;
    rdExpenditureUSD: number;
    marketCapUSD: number;
}

// Nested interface for Pipeline Summary
export interface PipelineSummary {
    phase1Count: number;
    phase2Count: number;
    phase3Count: number;
}

// Full Company Interface 
export interface Company {
    companyId: string;
    companyName: string;
    sponsorType: string;
    financials: CompanyFinancials;
    pipelineSummary: PipelineSummary;
    activeRegions: string[];
    therapeuticAreasCovered: string[];
    complianceScore: number;
    riskLevel: string;
    website: string;
    foundedYear: number;
    trialsRan: number;
    successRatio: number;
    avgTrialCompletionTime: number;
    totalSubjectsHandled: number;
    protocols: Protocol[];
}