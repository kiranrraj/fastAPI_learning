// components/sidebar/sidebar.types.ts

export interface Investigation {
    id: string;
    name: string;
}

export interface InvestigationGroup {
    id: string;
    name: string;
    investigations: Investigation[];
}

// Alias SidebarGroup to the same shape (if it's identical)
export type SidebarGroup = InvestigationGroup;
