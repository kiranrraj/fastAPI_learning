// src/app/types/tab.types.ts

/// Structure of a tab in the tabbed interface.

export type TabType = {
    id: string;              // Tab Id, this should be unique
    type: "group" | "item";  // Type of the tab, it may have multiple portlets(group) or a single portlet
    title: string;           // Tab title
    data: any;               // Tab data
    pinned?: boolean;        // Tab is pinned or not

    //UI State Scopes
    filterText?: string;                                // Any filter 
    sortOrder?: "asc" | "desc" | "recent" | "favorite"; // Sort criteria
    viewMode?: "default" | "compact" | "table";         // View mode
    showOnlyFavorites?: boolean;                        // Only fav ??
    typeFilter?: string | null;                         // Type filter(like only graph portlet, only table portlets)
    hiddenItemIds?: string[];                           // Any portlets to be hidden, its tab id 
};

export interface SharedTabHandlerOptions {
    tabs: TabType[];
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    openTab: (tab: TabType) => void;
}
