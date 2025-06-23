// src/app/utils/tab/coreTabHandlers.ts

import { TabMap, TabMeta } from "@/app/types/tab.types";

interface CoreTabHandlersOptions {
    tabs: TabMap;
    setTabs: React.Dispatch<React.SetStateAction<TabMap>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabMeta[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabMeta[]>>;
}

/**
 * Core tab lifecycle handlers:
 * - openTab: adds/focuses a tab
 * - closeTab: removes and archives a tab
 * - updateTab: updates metadata
 * - restoreLastClosed: brings back last closed tab
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
     * Open a tab or focus if already exists.
     */
    function openTab(newTab: TabMeta) {
        const exists = tabs[newTab.id];

        if (exists) {
            setActiveTabId(newTab.id);
        } else {
            setTabs((prev) => ({
                ...prev,
                [newTab.id]: {
                    ...newTab,
                    createdAt: Date.now(), // timestamp for sorting
                    focus: true,
                },
            }));
            setActiveTabId(newTab.id);
        }

        console.log(`[openTab] -> ${newTab.id}`);
    }

    /**
     * Close a tab by ID.
     * Moves it to closedStack.
     */
    function closeTab(tabId: string) {
        const closingTab = tabs[tabId];
        if (!closingTab) return;

        const { [tabId]: _, ...rest } = tabs;
        setTabs(rest);
        setClosedStack((prev) => [closingTab, ...prev]);

        if (activeTabId === tabId) {
            const fallbackTab = Object.values(rest).at(-1);
            setActiveTabId(fallbackTab?.id ?? null);
        }

        console.log(`[closeTab] -> ${tabId}`);
    }

    /**
     * Update a tab's metadata (like pinned, viewMode, etc.)
     */
    function updateTab(tabId: string, updates: Partial<TabMeta>) {
        if (!tabs[tabId]) return;

        setTabs((prev) => ({
            ...prev,
            [tabId]: {
                ...prev[tabId],
                ...updates,
            },
        }));

        console.log(`[updateTab] -> ${tabId}`, updates);
    }

    /**
     * Restore the last closed tab from the stack.
     */
    function restoreLastClosed() {
        setClosedStack((prev) => {
            if (prev.length === 0) return prev;

            const [lastClosed, ...rest] = prev;
            setTabs((prevTabs) => ({
                ...prevTabs,
                [lastClosed.id]: {
                    ...lastClosed,
                    createdAt: Date.now(), // reset open time
                },
            }));
            setActiveTabId(lastClosed.id);

            console.log(`[restoreLastClosed] -> ${lastClosed.id}`);
            return rest;
        });
    }

    return {
        openTab,
        closeTab,
        updateTab,
        restoreLastClosed,
    };
}
