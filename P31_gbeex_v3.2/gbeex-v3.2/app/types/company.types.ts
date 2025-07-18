// \gbeex-v3.2\app\types\company.types.ts

import { Protocol } from './protocol.types';
export * from './subject.types';
export * from './site.types';
export * from './protocol.types';

export interface Company {
    companyId: string;
    companyName: string;
    sponsorType: string;
    headquarters: string;
    activeRegions: string[];
    therapeuticAreasCovered: string[];
    complianceScore: number;
    riskLevel: string;
    protocols: Protocol[];
}

interface CompanyContextType {
    companies: Company[];
    isLoading: boolean;
}