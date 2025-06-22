// src/app/utils/tab/tabControlUtils.ts

import { TabType } from "@/app/types/tab.types";

/**
 * Filters tabs based on a search query (case-insensitive).
 */
export function filterTabs(tabs: TabType[], query: string): TabType[] {
    return tabs.filter((tab) =>
        tab.title.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * Sorts tabs by title or by pinned status.
 */
export function sortTabs(
    tabs: TabType[],
    order: "asc" | "desc" | "favorite"
): TabType[] {
    switch (order) {
        case "asc":
            return [...tabs].sort((a, b) => a.title.localeCompare(b.title));
        case "desc":
            return [...tabs].sort((a, b) => b.title.localeCompare(a.title));
        case "favorite":
            return [...tabs].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        default:
            return tabs;
    }
}

/**
 * Closes all tabs that are not pinned.
 */
export function closeAllTabs(tabs: TabType[]): TabType[] {
    return tabs.filter((tab) => tab.pinned);
}

/**
 * Removes pinned state from all tabs.
 */
export function resetFavorites(tabs: TabType[]): TabType[] {
    return tabs.map((tab) => ({ ...tab, pinned: false }));
}

/**
 * Toggles the pinned (favorite) status of a tab.
 */
export function toggleFavorite(
    tabs: TabType[],
    updateTab: (tabId: string, updates: Partial<TabType>) => void,
    tabId: string
): void {
    const target = tabs.find((tab) => tab.id === tabId);
    if (target) {
        updateTab(tabId, { pinned: !target.pinned });

        // testing
        // console.log(`[Favorite] Toggled favorite for tab: ${tabId}, now: ${!target.pinned}`);
    }
}
