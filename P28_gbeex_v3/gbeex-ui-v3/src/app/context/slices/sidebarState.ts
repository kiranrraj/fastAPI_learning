// src/app/context/slices/sidebarState.ts

import { PortletNode } from "@/app/types/common/portlet.types";

// SidebarState interface
export interface SidebarState {
    searchQuery: string;
    sortOrder: "asc" | "desc" | "default";
    favoriteIds: string[];
    lockIds: string[];
    hiddenIds: string[];
    portletData: PortletNode[];
    expandedGroups: Record<string, boolean>;
    expandAllCounter: number;
    collapseAllCounter: number;
}

// Default state values
export const defaultSidebarState: SidebarState = {
    searchQuery: "",
    sortOrder: "default",
    favoriteIds: [],
    lockIds: [],
    hiddenIds: [],
    portletData: [],
    expandedGroups: {},
    expandAllCounter: 0,
    collapseAllCounter: 0,
};
