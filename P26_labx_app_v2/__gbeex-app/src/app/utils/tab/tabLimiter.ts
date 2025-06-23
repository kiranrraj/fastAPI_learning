// src/app/utils/tab/tabLimiter.ts

import { TabMap, TabMeta } from "@/app/types/tab.types";

/**
 * Optional: Maximum number of tabs allowed open at once (customize as needed).
 */
const MAX_TABS = 20;

/**
 * Returns true if a new tab can be opened based on tab count limit.
 */
export function canOpenMoreTabs(tabs: TabMap): boolean {
    const tabCount = Object.keys(tabs).length;
    const allowed = tabCount < MAX_TABS;

    console.log(`[tabLimiter] Tabs open: ${tabCount}, Allowed to open more: ${allowed}`);
    return allowed;
}

/**
 * Removes the oldest non-pinned tab to free space.
 * Returns a new TabMap with one tab removed, or the same if no removal is possible.
 */
export function enforceTabLimit(tabs: TabMap): TabMap {
    const entries = Object.entries(tabs);

    // Get non-pinned tabs sorted by createdAt (oldest first)
    const removable = entries
        .filter(([, tab]) => !tab.pinned)
        .sort(([, a], [, b]) => (a.createdAt ?? 0) - (b.createdAt ?? 0));

    if (removable.length === 0) {
        console.warn("[tabLimiter] No removable tab found");
        return tabs;
    }

    const [removeId] = removable[0];
    const updatedTabs: TabMap = { ...tabs };
    delete updatedTabs[removeId];

    console.log("[tabLimiter] Removed oldest non-pinned tab:", removeId);
    return updatedTabs;
}

/**
 * Returns the ID of the most recently created tab (used for fallback focus).
 */
export function getLastCreatedTabId(tabs: TabMap): string | null {
    const sorted = Object.entries(tabs).sort(
        ([, a], [, b]) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
    );

    const recent = sorted[0]?.[0] ?? null;
    console.log("[tabLimiter] Last created tab ID:", recent);
    return recent;
}
