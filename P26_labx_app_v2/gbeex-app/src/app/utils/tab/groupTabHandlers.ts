// src/app/utils/tab/groupTabHandlers.ts

import { TabType } from "@/app/types/tab.types";
import { createTabHandlers } from "./tabHandlers";

interface Group {
    id: string;
    name: string;
}

interface GroupTabHandlerOptions {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}

/**
 * Returns a handler to open group tabs.
 * Will activate existing group tab or create a new one if not present.
 */
export function createGroupTabHandlers(options: GroupTabHandlerOptions) {
    const { tabs, openTab, setActiveTabId } = {
        ...options,
        ...createTabHandlers(options),
    };

    function openGroupTab(group: Group) {
        const tabId = `group-${group.id}`;

        // If already open, just focus it
        const existing = tabs.find((tab) => tab.id === tabId);
        if (existing) return setActiveTabId(tabId);

        // Otherwise, open a new group tab
        const newTab: TabType = {
            id: tabId,
            type: "group",
            title: group.name,
            pinned: false,
            data: group,
        };

        openTab(newTab);
    }

    return { openGroupTab };
}
