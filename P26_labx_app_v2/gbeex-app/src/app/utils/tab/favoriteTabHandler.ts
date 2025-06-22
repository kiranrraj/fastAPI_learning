// src/app/utils/tab/favoriteTabHandler.ts

import { TabType } from "@/app/types/tab.types";

interface FavoriteHandlerOptions {
    tabs: TabType[];
    updateTab: (tabId: string, updates: Partial<TabType>) => void;
}

export function createFavoriteHandlers({ tabs, updateTab }: FavoriteHandlerOptions) {
    function toggleFavorite(tabId: string) {
        const target = tabs.find((tab) => tab.id === tabId);
        if (target) {
            updateTab(tabId, { pinned: !target.pinned });
        }
    }

    return { toggleFavorite };
}
