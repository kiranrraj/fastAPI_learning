// ---- protocol.types.ts ----

import { Site } from "./company.types";

export interface Budget {
    totalBudgetUSD: number;
    costPerPatientUSD: number;
}

export interface Protocol {
    protocolId: string;
    protocolName: string;
    drugName: string;
    phase: 'I' | 'II' | 'III';
    budget: Budget;
    sites: Site[];
}