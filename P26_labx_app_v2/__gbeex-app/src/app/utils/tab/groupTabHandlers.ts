// src/app/utils/tab/groupTabHandlers.ts

import { TabMeta, TabMap } from "@/app/types/tab.types";

interface GroupTabHandlerOptions {
    tabs: TabMap;
    setActiveTabId: (id: string | null) => void;
    openTab: (tab: TabMeta) => void;
}

/**
 * Generates a handler to open a new tab for a group (collection of portlets).
 */
export function createGroupTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
}: GroupTabHandlerOptions) {
    /**
     * Opens a new tab for a group.
     */
    function openGroupTab(group: any) {
        const tabId = `group-${group.id}`;

        if (tabs[tabId]) {
            console.log("[openGroupTab] Group tab already open:", tabId);
            setActiveTabId(tabId);
            return;
        }

        const tab: TabMeta = {
            id: tabId,
            type: "group",
            title: group.name || `Group ${group.id}`,
            data: group,
            createdAt: Date.now(),
            position: Object.keys(tabs).length,
        };

        console.log("[openGroupTab] Opening new group tab:", tabId);
        openTab(tab);
    }

    return { openGroupTab };
}
