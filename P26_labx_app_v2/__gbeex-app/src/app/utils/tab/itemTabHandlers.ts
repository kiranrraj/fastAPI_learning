// src/app/utils/tab/itemTabHandlers.ts

import { TabMeta, TabMap } from "@/app/types/tab.types";

interface ItemTabHandlerOptions {
    tabs: TabMap;
    setActiveTabId: (id: string | null) => void;
    openTab: (tab: TabMeta) => void;
}

/**
 * Generates a handler to open a new tab for a specific item (investigation).
 */
export function createItemTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
}: ItemTabHandlerOptions) {
    /**
     * Opens a new tab for a given item.
     */
    function openItemTab(item: any) {
        const tabId = `item-${item.id}`;

        if (tabs[tabId]) {
            console.log("[openItemTab] Item tab already open:", tabId);
            setActiveTabId(tabId);
            return;
        }

        const tab: TabMeta = {
            id: tabId,
            type: "item",
            title: item.name || `Item ${item.id}`,
            data: item,
            createdAt: Date.now(),
            position: Object.keys(tabs).length,
        };

        console.log("[openItemTab] Opening new item tab:", tabId);
        openTab(tab);
    }

    return { openItemTab };
}
