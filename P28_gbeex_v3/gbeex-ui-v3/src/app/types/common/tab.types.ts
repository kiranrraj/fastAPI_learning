// src/app/types/common/tab.types.ts

export type TabType = {
    id: string;                         // Unique ID for the tab (could be group/item ID)
    title: string;                      // Title shown in the tab bar
    type: "group" | "item" | "default"; // Type of tab: single item, group, or default view
    closable: boolean;                  // Whether user can close it
    pinned?: boolean;                   // Optional: is this a pinned (favorite) tab?
};
