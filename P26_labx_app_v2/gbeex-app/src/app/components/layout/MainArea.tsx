// src/app/components/layout/MainArea.tsx

"use client";

import React, { useState } from "react";
import SidebarArea from "../layout/sidebar/SidebarArea";
import ContentArea from "../layout/content/ContentArea";
import styles from "@/app/components/styles/MainArea.module.css";
import TabControlBar from "../layout/tabs/TabControlBar";

import { useTabState } from "@/app/hooks/tabs/useTabState";
import { createTabHandlersBundle } from "@/app/utils/tab/tabHandlers";
import { createGroupTabHandlers } from "@/app/utils/tab/groupTabHandlers";
import { createItemTabHandlers } from "@/app/utils/tab/itemTabHandlers";
import { toggleFavorite as toggleFavoriteUtil } from "@/app/utils/tab/tabControlUtils";

import {
  closeAllTabs,
  resetFavorites,
  sortTabs,
  filterTabs,
} from "@/app/utils/tab/tabControlUtils";
import { TabType } from "@/app/types/tab.types";

const MainArea: React.FC = () => {
  const {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
  } = useTabState();

  const { openTab, closeTab, updateTab, restoreLastClosed } =
    createTabHandlersBundle({
      tabs,
      setTabs,
      activeTabId,
      setActiveTabId,
      closedStack,
      setClosedStack,
    });

  const { openGroupTab } = createGroupTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
  });

  const { openItemTab } = createItemTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
  });

  const toggleFavorite = (tabId: string) =>
    toggleFavoriteUtil(tabs, updateTab, tabId);

  // UI filter state
  const [filteredTabs, setFilteredTabs] = useState<TabType[]>(tabs);

  // Keep filteredTabs updated when tabs change
  React.useEffect(() => {
    setFilteredTabs(tabs);
  }, [tabs]);

  const handleSearch = (query: string) => {
    setFilteredTabs(filterTabs(tabs, query));
  };

  const handleSort = (criteria: "asc" | "desc" | "favorite") => {
    setFilteredTabs(sortTabs([...tabs], criteria));
  };

  const handleCloseAllTabs = () => {
    const remaining = closeAllTabs(tabs);
    setTabs(remaining);
  };

  const handleResetFavorites = () => {
    const updated = resetFavorites(tabs);
    setTabs(updated);
  };

  return (
    <main className={`flex flex-1 ${styles.mainArea}`}>
      <SidebarArea onGroupClick={openGroupTab} onItemClick={openItemTab} />

      <div className="flex flex-col flex-1">
        <TabControlBar
          tabs={tabs}
          onSearch={handleSearch}
          onSort={handleSort}
          onRestoreLastClosed={restoreLastClosed}
          onCloseAllTabs={handleCloseAllTabs}
          onResetFavorites={handleResetFavorites}
        />

        <ContentArea
          tabs={filteredTabs}
          activeTabId={activeTabId}
          onTabClick={setActiveTabId}
          onTabClose={closeTab}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </main>
  );
};

export default React.memo(MainArea);
