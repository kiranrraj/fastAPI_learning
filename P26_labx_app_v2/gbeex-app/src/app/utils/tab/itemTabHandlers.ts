// src/app/utils/tab/itemTabHandlers.ts

import { TabType } from "@/app/types/tab.types";

interface Item {
    id: string;
    name: string;
}

export interface ItemTabHandlerOptions {
    tabs: TabType[];
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    openTab: (tab: TabType) => void;
}

export function createItemTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
}: ItemTabHandlerOptions) {
    function openItemTab(item: Item) {
        const tabId = `item-${item.id}`;
        const existing = tabs.find((tab) => tab.id === tabId);

        if (existing) {
            setActiveTabId(tabId);
            return;
        }

        openTab({
            id: tabId,
            type: "item",
            title: item.name,
            pinned: false,
            data: item,
        });
    }

    return { openItemTab };
}
