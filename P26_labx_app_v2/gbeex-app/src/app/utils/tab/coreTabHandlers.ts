// src/app/utils/tab/coreTabHandlers.ts

import { TabType } from "@/app/types/tab.types";

interface CoreTabHandlersOptions {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}

/**
 * Creates core tab management handlers: openTab, closeTab, updateTab, restoreLastClosed
 */
export function createCoreTabHandlers({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
}: CoreTabHandlersOptions) {
    /**
     * Open a new tab or focus it if already exists
     */
    function openTab(newTab: TabType) {
        const exists = tabs.find((tab) => tab.id === newTab.id);
        if (exists) {
            setActiveTabId(newTab.id);
        } else {
            setTabs([...tabs, newTab]);
            setActiveTabId(newTab.id);
        }

        // testing
        // console.log(`[openTab] Opened or focused tab: ${newTab.id}`);
    }

    /**
     * Close a tab and update closed stack
     */
    function closeTab(tabId: string) {
        const closingTab = tabs.find((tab) => tab.id === tabId);
        if (!closingTab) return;

        const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(remainingTabs);
        setClosedStack([closingTab, ...closedStack]);

        // Auto-switch to last tab if the closing one is active
        if (activeTabId === tabId) {
            if (remainingTabs.length > 0) {
                setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
            } else {
                setActiveTabId(null);
            }
        }

        // testing
        // console.log(`[closeTab] Closed tab: ${tabId}`);
    }

    /**
     * Update a tab's properties by ID
     */
    function updateTab(tabId: string, updates: Partial<TabType>) {
        const updatedTabs = tabs.map((tab) =>
            tab.id === tabId ? { ...tab, ...updates } : tab
        );
        setTabs(updatedTabs);

        // testing
        // console.log(`[updateTab] Updated tab: ${tabId}`, updates);
    }

    /**
     * Restore the most recently closed tab
     * Only restores one tab at a time
     */
    function restoreLastClosed() {
        if (closedStack.length === 0) return;

        const [lastClosed, ...rest] = closedStack;
        setTabs([...tabs, lastClosed]);
        setActiveTabId(lastClosed.id);
        setClosedStack(rest);

        // testing
        // console.log(`[restoreLastClosed] Restored tab: ${lastClosed.id}`);
    }

    return {
        openTab,
        closeTab,
        updateTab,
        restoreLastClosed,
    };
}
