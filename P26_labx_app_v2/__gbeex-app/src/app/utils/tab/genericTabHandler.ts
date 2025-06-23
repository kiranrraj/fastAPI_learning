// src/app/utils/tab/genericTabHandler.ts

import { TabMeta, TabMap } from "@/app/types/tab.types";

/**
 * Shared base props for all tab-related operations.
 * Used by group and item handlers.
 */
export interface SharedTabHandlerOptions {
    tabs: TabMap;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    openTab: (tab: TabMeta) => void;
}

/**
 * Utility to create a basic TabMeta object.
 * Can be reused by both group and item handlers.
 */
export function buildTab({
    id,
    title,
    type,
    data,
    description,
}: {
    id: string;
    title: string;
    type: "group" | "item";
    data: any;
    description?: string;
}): TabMeta {
    const now = Date.now();

    const tab: TabMeta = {
        id,
        title,
        type,
        data,
        createdAt: now,
        pinned: false,
        focus: false,
        description: description || "",
        filterText: "",
        sortOrder: "asc",
        viewMode: "default",
        showOnlyFavorites: false,
        typeFilter: null,
        hiddenItemIds: [],
    };

    console.log("[buildTab] Created new tab:", tab);
    return tab;
}
