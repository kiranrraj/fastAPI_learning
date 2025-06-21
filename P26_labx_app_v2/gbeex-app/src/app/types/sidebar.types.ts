// components/sidebar/sidebar.types.ts

// Base types
export interface Investigation {
    id: string;
    name: string;
}

export interface InvestigationItem {
    id: string;
    name: string;
}

export interface InvestigationGroup {
    id: string;
    name: string;
    children: InvestigationItem[];
}

export interface InvestigationChild {
    id: string;
    name: string;
}

