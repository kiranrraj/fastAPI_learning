// src/app/utils/tab/tabLimiter.ts

import { TabType } from "@/app/types/tab.types";
import { MAX_OPEN_TABS, MAX_TAB_TOOLTIP } from "@/app/constants/tabs/tab.constants";

/**
 * Checks if a new tab can be opened based on the current tab count.
 * @param tabs - The list of currently open tabs
 * @returns Boolean indicating permission
 */
export function canOpenMoreTabs(tabs: TabType[]): boolean {
    return tabs.length < MAX_OPEN_TABS;
}

/**
 * Returns tooltip if tab limit is exceeded.
 * @param tabs - The list of currently open tabs
 * @returns Tooltip message or empty string
 */
export function getTabLimitTooltip(tabs: TabType[]): string {
    return canOpenMoreTabs(tabs) ? "" : MAX_TAB_TOOLTIP;
}

/**
 * Safe wrapper around "openTab", blocks it if limit reached.
 * @param tabs - Current open tabs
 * @param openTab - The openTab function from tab handler
 * @param newTab - The new tab to open
 * @returns Boolean indicating whether tab was opened
 */
export function tryOpenTab(
    tabs: TabType[],
    openTab: (tab: TabType) => void,
    newTab: TabType
): boolean {
    if (!canOpenMoreTabs(tabs)) {
        console.warn("Tab limit reached. Cannot open:", newTab.title);
        return false;
    }

    openTab(newTab);
    return true;
}
