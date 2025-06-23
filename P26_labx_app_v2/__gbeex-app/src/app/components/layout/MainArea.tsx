"use client";

/**
 * Component: MainArea
 * -------------------
 * This is the core layout component managing the sidebar and content area.
 *
 * INPUTS:
 * - Fetches group data using useSidebarData (mapped to children).
 * - Uses TabMap for managing tabs.
 *
 * OUTPUT:
 * - Renders SidebarArea and ContentArea
 * - Controls tab lifecycle and state management (open, close, favorite, restore)
 */

import React, { useEffect, useState } from "react";
import SidebarArea from "@/app/components/layout/sidebar/SidebarArea";
import ContentArea from "@/app/components/layout/ContentArea";
import { PortletGroup } from "@/app/types/sidebar.types";
import { TabMap } from "@/app/types/tab.types";
import { useSidebarData } from "@/app/hooks/api/useApiData";

// Import tab handling utilities
import {
  closeTab,
  toggleFavoriteTab,
  restoreLastClosedTab,
  closeAllTabs,
} from "@/app/utils/tab/tabControlUtils";

import { openGroupTab } from "@/app/utils/tab/groupTabHandlers";
import { openItemTab } from "@/app/utils/tab/itemTabHandlers";

const MainArea: React.FC = () => {
  const [groupData, setGroupData] = useState<PortletGroup[]>([]);
  const [tabs, setTabs] = useState<TabMap>({});
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [closedTabsStack, setClosedTabsStack] = useState<string[]>([]);

  // Load sidebar group data once on mount
  useEffect(() => {
    const { groups } = useSidebarData();
    setGroupData(groups);
  }, []);

  // --- Tab Handlers ---

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleTabClose = (tabId: string) => {
    const { updatedTabs, closedTabId, prevTabId } = closeTab(
      tabs,
      tabId,
      activeTabId
    );
    setTabs(updatedTabs);
    setClosedTabsStack((prev) => [...prev, closedTabId]);
    setActiveTabId(prevTabId);
  };

  const handleToggleFavorite = (tabId: string) => {
    const updatedTabs = toggleFavoriteTab(tabs, tabId);
    setTabs(updatedTabs);
  };

  const handleRestoreTab = () => {
    const { restoredTabs, restoredTabId, updatedStack } = restoreLastClosedTab(
      tabs,
      closedTabsStack
    );
    setTabs(restoredTabs);
    setClosedTabsStack(updatedStack);
    if (restoredTabId) setActiveTabId(restoredTabId);
  };

  const handleCloseAll = () => {
    const { updatedTabs, preservedTabId } = closeAllTabs(tabs);
    setTabs(updatedTabs);
    setActiveTabId(preservedTabId);
  };

  const handleOpenGroupTab = (group: PortletGroup) => {
    const { updatedTabs, newTabId } = openGroupTab(tabs, group);
    setTabs(updatedTabs);
    setActiveTabId(newTabId);
  };

  const handleOpenItemTab = (portlet: any) => {
    const { updatedTabs, newTabId } = openItemTab(tabs, portlet);
    setTabs(updatedTabs);
    setActiveTabId(newTabId);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Sidebar listing portlet groups and items */}
      <SidebarArea
        groupData={groupData}
        onGroupClick={handleOpenGroupTab}
        onItemClick={handleOpenItemTab}
      />

      {/* Right pane: Content area with tab management */}
      <ContentArea
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onToggleFavorite={handleToggleFavorite}
        groupData={groupData}
      />
    </div>
  );
};

export default MainArea;
