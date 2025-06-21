// components/sidebar/sidebar.types.ts

// Base types
export interface Investigation {
    id: string;
    name: string;
}

export interface InvestigationGroup {
    id: string;
    name: string;
    investigations: Investigation[];
}

// Sidebar-specific
export type SidebarGroup = InvestigationGroup;

export type SortOrder = "az" | "za";

export interface SidebarHeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOrder: SortOrder;
    setSortOrder: (value: SortOrder) => void;
    expanded: boolean;
    setExpanded: (value: boolean) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
}