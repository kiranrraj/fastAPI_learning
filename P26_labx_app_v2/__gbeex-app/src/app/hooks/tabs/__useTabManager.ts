import { useState } from "react";
import { TabType } from "@/app/types/tab.types";
import { createTabHandlers } from "@/app/utils/tab/tabHandlers";

// Custom hook to manage all tab state and expose tab control functions.

export function useTabManager() {
    // State: list of currently open tabs
    const [tabs, setTabs] = useState<TabType[]>([]);

    // State: ID of the currently active tab
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    // State: recently closed tabs, for undo/restore
    const [closedStack, setClosedStack] = useState<TabType[]>([]);

    // Create handlers using the current state and setters
    const {
        openTab,
        closeTab,
        restoreLastClosed,
        updateTab,
    } = createTabHandlers({
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        closedStack,
        setClosedStack,
    });

    return {
        tabs,
        activeTabId,
        openTab,
        closeTab,
        restoreLastClosed,
        updateTab,
        setActiveTabId,
    };
}
