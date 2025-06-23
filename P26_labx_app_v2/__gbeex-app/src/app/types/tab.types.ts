// src/app/types/tab.types.ts

/**
 * Describes the shape of arbitrary data held inside a tab.
 * This is usually a portlet group or investigation object.
 */
export interface TabData {
    [key: string]: any;
}

/**
 * Unified structure for a single tab inside the tab map.
 */
export interface TabMeta {
    id: string;                         // Unique tab ID
    type: "group" | "item";             // Tab type: group or individual item
    title: string;                      // Display title in the UI
    data: TabData;                      // Underlying portlet data (can be any type)

    // Optional metadata
    pinned?: boolean;                   // True if the tab is "favorite"
    createdAt?: number;                 // Timestamp when the tab was created
    description?: string;              // Optional tooltip/hover info
    focus?: boolean;                    // True if the tab was recently focused
    position?: number;

    // UI-specific filters and controls
    filterText?: string;               // Current text filter applied
    sortOrder?: "asc" | "desc" | "recent" | "favorite"; // Sorting method
    viewMode?: "default" | "compact" | "table";         // Display mode
    showOnlyFavorites?: boolean;       // Limit content to only favorites
    typeFilter?: string | null;        // Portlet type filter (e.g. only maps)
    hiddenItemIds?: string[];          // Child portlets to hide in this tab
}

/**
 * Map-style structure holding all tabs.
 * This is the primary tab store for performance and scalability.
 * Keys are tab IDs, values are the tab metadata.
 */
export type TabMap = Record<string, TabMeta>;

/**
 * Type alias for general tab usage (creation/opening).
 */
export type TabType = TabMeta;

/**
 * Shared tab handler options passed to both group/item tab handlers.
 */
export interface SharedTabHandlerOptions {
    tabs: TabMap;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    openTab: (tab: TabMeta) => void;
}
