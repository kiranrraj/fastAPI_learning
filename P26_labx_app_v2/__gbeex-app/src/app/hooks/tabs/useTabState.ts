import { useState } from "react";
import { TabMap, TabMeta } from "@/app/types/tab.types";

/**
 * Custom hook for managing tab state using a map-style structure.
 * - Stores open tabs as a key-value object (TabMap)
 * - Tracks currently active tab ID
 * - Maintains a stack of recently closed tabs for restoring
 */
export function useTabState() {
    // Map of all open tabs, keyed by tab ID
    const [tabs, setTabs] = useState<TabMap>({});

    // ID of the currently active tab
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    // Stack of closed tabs for "Restore Last Closed" functionality
    const [closedStack, setClosedStack] = useState<TabMeta[]>([]);

    // Debug logs for development
    console.log("[useTabState] tabs:", tabs);
    console.log("[useTabState] activeTabId:", activeTabId);
    console.log("[useTabState] closedStack:", closedStack);

    return {
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        closedStack,
        setClosedStack,
    };
}
