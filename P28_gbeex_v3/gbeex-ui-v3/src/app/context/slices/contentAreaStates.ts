// src/app/context/slices/contentAreaState.ts

import { TabType } from "@/app/types/common/tab.types";

// Define content area state
export interface ContentAreaState {
    openTabs: TabType[];               // All currently open tabs
    activeTabId: string | null;        // Currently selected tab
    lastClosedTab: TabType | null;     // Last closed (for undo restore)
    favoriteTabIds: string[];          // Marked favorite tabs
    lockedTabIds: string[];            // Tabs that cannot be closed
    hiddenTabIds: string[];            // Hidden from view (manual or programmatic)
    defaultTabs: TabType[];            // Portlets shown when no tab is selected
    lastUpdatedTime: Date | null;      // Global refresh marker
}

// Default content area state
export const defaultContentAreaState: ContentAreaState = {
    openTabs: [],
    activeTabId: null,
    lastClosedTab: null,
    favoriteTabIds: [],
    lockedTabIds: [],
    hiddenTabIds: [],
    defaultTabs: [], // Initially empty
    lastUpdatedTime: null,
};
