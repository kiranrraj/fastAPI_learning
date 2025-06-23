// src/app/utils/tab/tabHandlers.ts

import { TabMap, TabMeta } from "@/app/types/tab.types";

interface TabHandlerBundleOptions {
    tabs: TabMap;
    setTabs: React.Dispatch<React.SetStateAction<TabMap>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabMeta[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabMeta[]>>;
}

/**
 * Returns common tab handler functions for managing TabMap.
 */
export function createTabHandlersBundle({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
}: TabHandlerBundleOptions) {
    /**
     * Opens a tab if not already present. If present, focus it.
     */
    function openTab(tab: TabMeta) {
        setTabs((prevTabs) => {
            const exists = prevTabs[tab.id];

            if (exists) {
                // Just focus existing tab
                console.log("[openTab] Tab already exists:", tab.id);
                setActiveTabId(tab.id);
                return prevTabs;
            }

            // Assign a new position based on current size
            const newTab: TabMeta = {
                ...tab,
                position: Object.keys(prevTabs).length,
                createdAt: Date.now(),
            };

            const updated: TabMap = {
                ...prevTabs,
                [tab.id]: newTab,
            };

            console.log("[openTab] New tab added:", tab.id);
            setActiveTabId(tab.id);
            return updated;
        });
    }

    /**
     * Closes a tab and pushes it to the closedStack for restore.
     */
    function closeTab(tabId: string) {
        const closingTab = tabs[tabId];
        if (!closingTab) return;

        const { [tabId]: _, ...rest } = tabs;
        setTabs(rest);
        setClosedStack([closingTab, ...closedStack]);
        console.log("[closeTab] Closed tab:", tabId);

        // Reset focus
        if (activeTabId === tabId) {
            const remainingTabs = Object.values(rest).sort((a, b) => (b.position ?? 0) - (a.position ?? 0));
            const lastFocused = remainingTabs[0]?.id || null;
            setActiveTabId(lastFocused);
            console.log("[closeTab] Focus switched to:", lastFocused);
        }
    }

    /**
     * Restore the most recently closed tab from the stack.
     */
    function restoreLastClosed() {
        if (closedStack.length === 0) {
            console.log("[restoreLastClosed] No tab to restore.");
            return;
        }

        const [last, ...restStack] = closedStack;
        openTab(last); // reassigns position and time
        setClosedStack(restStack);

        console.log("[restoreLastClosed] Restored tab:", last.id);
    }

    /**
     * Patch a tab’s metadata.
     */
    function updateTab(tabId: string, patch: Partial<TabMeta>) {
        setTabs((prevTabs) => {
            const current = prevTabs[tabId];
            if (!current) return prevTabs;

            const updated: TabMap = {
                ...prevTabs,
                [tabId]: {
                    ...current,
                    ...patch,
                },
            };

            console.log("[updateTab] Updated tab:", tabId, "with patch:", patch);
            return updated;
        });
    }

    return {
        openTab,
        closeTab,
        restoreLastClosed,
        updateTab,
    };
}
