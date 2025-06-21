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

export interface SidebarGroup {
    id: string;
    name: string;
    investigations: { id: string; name: string }[];
}
