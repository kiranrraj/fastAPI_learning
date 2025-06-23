// src/app/utils/tab/tabControlUtils.ts

import { TabMap, TabMeta } from "@/app/types/tab.types";

/**
 * Filters tabs by checking if the query exists in the title or description.
 */
export function filterTabs(tabs: TabMap, query: string): TabMap {
    const lowerQuery = query.toLowerCase();

    const filtered: TabMap = {};

    Object.entries(tabs).forEach(([id, tab]) => {
        const inTitle = tab.title?.toLowerCase().includes(lowerQuery);
        const inDesc = tab.description?.toLowerCase().includes(lowerQuery);

        if (inTitle || inDesc) {
            filtered[id] = tab;
        }
    });

    console.log("[filterTabs] Query:", query, "Result:", Object.keys(filtered));
    return filtered;
}

/**
 * Sorts tabs by given criteria: asc, desc, or favorite.
 */
export function sortTabs(tabs: TabMap, criteria: "asc" | "desc" | "favorite"): TabMap {
    const sorted: [string, TabMeta][] = Object.entries(tabs).sort(([, a], [, b]) => {
        switch (criteria) {
            case "asc":
                return a.title.localeCompare(b.title);
            case "desc":
                return b.title.localeCompare(a.title);
            case "favorite":
                return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            default:
                return 0;
        }
    });

    const sortedMap: TabMap = {};
    sorted.forEach(([id, tab], index) => {
        sortedMap[id] = { ...tab, position: index }; // update position after sort
    });

    console.log("[sortTabs] Sorted by:", criteria, "New Order:", Object.keys(sortedMap));
    return sortedMap;
}

/**
 * Removes all non-pinned tabs from the TabMap.
 */
export function closeAllTabs(tabs: TabMap): TabMap {
    const filtered: TabMap = {};

    Object.entries(tabs).forEach(([id, tab]) => {
        if (tab.pinned) {
            filtered[id] = tab;
        }
    });

    console.log("[closeAllTabs] Remaining pinned tabs:", Object.keys(filtered));
    return filtered;
}

/**
 * Resets all favorite (pinned) flags.
 */
export function resetFavorites(tabs: TabMap): TabMap {
    const updated: TabMap = {};

    Object.entries(tabs).forEach(([id, tab]) => {
        updated[id] = { ...tab, pinned: false };
    });

    console.log("[resetFavorites] All favorites removed");
    return updated;
}

/**
 * Toggles the favorite state (pinned) for a specific tab.
 */
export function toggleFavorite(
    tabs: TabMap,
    updateTab: (id: string, changes: Partial<TabMeta>) => void,
    tabId: string
) {
    const tab = tabs[tabId];
    if (!tab) {
        console.warn("[toggleFavorite] Tab not found:", tabId);
        return;
    }

    updateTab(tabId, { pinned: !tab.pinned });
    console.log("[toggleFavorite] Toggled pinned for:", tabId);
}
