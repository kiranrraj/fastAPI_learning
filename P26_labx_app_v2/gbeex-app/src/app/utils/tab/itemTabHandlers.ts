// src/app/utils/tab/itemTabHandlers.ts

import { TabType } from "@/app/types/tab.types";
import { createTabHandlers } from "./tabHandlers";

interface Item {
    id: string;
    name: string;
}

interface ItemTabHandlerOptions {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}

/**
 * Returns a handler to open item/investigation tabs.
 * Will activate existing item tab or create a new one.
 */
export function createItemTabHandlers(options: ItemTabHandlerOptions) {
    const { tabs, openTab, setActiveTabId } = {
        ...options,
        ...createTabHandlers(options),
    };

    function openItemTab(item: Item) {
        const tabId = `item-${item.id}`;

        const existing = tabs.find((tab) => tab.id === tabId);
        if (existing) return setActiveTabId(tabId);

        const newTab: TabType = {
            id: tabId,
            type: "item",
            title: item.name,
            pinned: false,
            data: item,
        };

        openTab(newTab);
    }

    return { openItemTab };
}
