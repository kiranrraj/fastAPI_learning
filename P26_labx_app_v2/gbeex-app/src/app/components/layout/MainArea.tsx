// src/app/components/layout/MainArea.tsx

"use client";

import React from "react";
import SidebarArea from "../layout/sidebar/SidebarArea";
import ContentArea from "../layout/content/ContentArea";
import styles from "@/app/components/styles/MainArea.module.css";

import { useTabState } from "@/app/hooks/tabs/useTabState";
import { createTabHandlers } from "@/app/utils/tab/tabHandlers";
import { createGroupTabHandlers } from "@/app/utils/tab/groupTabHandlers";
import { createItemTabHandlers } from "@/app/utils/tab/itemTabHandlers";
import { createFavoriteHandlers } from "@/app/utils/tab/favoriteTabHandler";

const MainArea: React.FC = () => {
  // 👇 Now we get raw state values
  const {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
  } = useTabState();

  // 👇 Inject raw state into tab logic handlers
  const { openTab, closeTab, updateTab, restoreLastClosed } = createTabHandlers(
    {
      tabs,
      setTabs,
      activeTabId,
      setActiveTabId,
      closedStack,
      setClosedStack,
    }
  );

  const { openGroupTab } = createGroupTabHandlers({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
  });

  const { openItemTab } = createItemTabHandlers({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
  });

  const { toggleFavorite } = createFavoriteHandlers({
    tabs,
    updateTab,
  });

  return (
    <main
      className={`flex flex-1 ${styles.mainArea}`}
      role="region"
      aria-label="Main Area"
    >
      <SidebarArea onGroupClick={openGroupTab} onItemClick={openItemTab} />

      <ContentArea
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={closeTab}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
};

export default React.memo(MainArea);
