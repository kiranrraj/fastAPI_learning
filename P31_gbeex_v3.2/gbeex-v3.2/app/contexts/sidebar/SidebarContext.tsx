// contexts/SidebarContext.tsx
"use client";

import React, { createContext } from "react";
import { SidebarView, SortOrder } from "@/app/types/sidebar.types";

export type SidebarContextType = {
  // State
  searchQuery: string;
  sortOrder: SortOrder;
  activeView: SidebarView;
  expandedNodeIds: Set<string>;
  favoriteIds: Set<string>;
  hiddenIds: Set<string>;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleSortOrder: () => void;
  setActiveView: (view: SidebarView) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  toggleFavorite: (nodeId: string) => void;
  toggleHidden: (nodeId: string) => void;
  resetSidebarState: () => void;
  setExpandedNodeIds: (ids: Set<string>) => void;
};

export const SidebarContext = createContext<SidebarContextType | null>(null);
