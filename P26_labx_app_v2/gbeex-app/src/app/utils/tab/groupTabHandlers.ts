// src/app/utils/tab/groupTabHandlers.ts

import { TabType } from "@/app/types/tab.types";

interface Group {
    id: string;
    name: string;
    children?: any[];
}

// CORRECT: This is the expected shape from tabHandlers.ts
export interface GroupTabHandlerOptions {
    tabs: TabType[];
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    openTab: (tab: TabType) => void;
}

export function createGroupTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
}: GroupTabHandlerOptions) {
    function openGroupTab(group: Group) {
        const tabId = `group-${group.id}`;
        const existing = tabs.find((tab) => tab.id === tabId);

        if (existing) {
            setActiveTabId(tabId);
            return;
        }

        openTab({
            id: tabId,
            type: "group",
            title: group.name,
            pinned: false,
            data: group,
        });
    }

    return { openGroupTab };
}
