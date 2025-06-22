// src/app/utils/tab/tabHandlers.ts

import { TabType, SharedTabHandlerOptions } from "@/app/types/tab.types";
import { createCoreTabHandlers } from "./coreTabHandlers";
import { createGroupTabHandlers } from "./groupTabHandlers";
import { createItemTabHandlers } from "./itemTabHandlers";
import { toggleFavorite as toggleFavoriteUtil } from "./tabControlUtils";

/**
 * Creates a bundle of all tab-related handlers.
 *
 * Inputs:
 * - tabs: list of all open tabs
 * - setTabs: state setter for tabs
 * - activeTabId: current active tab ID
 * - setActiveTabId: state setter for active tab
 * - closedStack: stack of closed tabs
 * - setClosedStack: state setter for closedStack
 *
 * Returns:
 * - Core tab handlers (open, close, update, restore)
 * - Group tab handler: openGroupTab
 * - Item tab handler: openItemTab
 * - Favorite tab handler: toggleFavorite
 */
export function createTabHandlersBundle({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
}: {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}) {
    // Core tab logic (openTab, closeTab, updateTab, restoreLastClosed)
    const core = createCoreTabHandlers({
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        closedStack,
        setClosedStack,
    });

    // Shared handlers for openGroupTab / openItemTab
    const sharedHandlers: SharedTabHandlerOptions = {
        tabs,
        setActiveTabId,
        openTab: core.openTab,
    };

    // Favorite toggle implemented using tabControlUtils
    const toggleFavorite = (tabId: string) => {
        toggleFavoriteUtil(tabs, core.updateTab, tabId);
        // console.log(`[DEBUG] Toggled favorite for tab ID: ${tabId}`);
    };

    return {
        ...core,
        ...createGroupTabHandlers(sharedHandlers),
        ...createItemTabHandlers(sharedHandlers),
        toggleFavorite,
    };
}
