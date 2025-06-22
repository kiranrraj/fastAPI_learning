// src/app/utils/tab/favoriteTabHandler.ts

import { TabType } from "@/app/types/tab.types";

interface FavoriteHandlerProps {
    tabs: TabType[];
    updateTab: (tabId: string, updates: Partial<TabType>) => void;
}

/**
 * Returns a handler to toggle a tab's favorite (pinned) status.
 */
export function createFavoriteHandlers({ tabs, updateTab }: FavoriteHandlerProps) {
    function toggleFavorite(tabId: string) {
        const tab = tabs.find((t: TabType) => t.id === tabId);
        if (!tab) return;
        updateTab(tabId, { pinned: !tab.pinned });
    }

    return { toggleFavorite };
}
