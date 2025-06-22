// src/app/components/layout/MainArea.tsx

"use client";

import React from "react";
import SidebarArea from "../layout/sidebar/SidebarArea";
import ContentArea from "../layout/content/ContentArea";
import styles from "@/app/components/styles/MainArea.module.css";

// State hook for managing tab state
import { useTabState } from "@/app/hooks/tabs/useTabState";

// Core + modular handler creators
import { createTabHandlersBundle } from "@/app/utils/tab/tabHandlers";
import { createGroupTabHandlers } from "@/app/utils/tab/groupTabHandlers";
import { createItemTabHandlers } from "@/app/utils/tab/itemTabHandlers";
import { createFavoriteHandlers } from "@/app/utils/tab/favoriteTabHandler";

const MainArea: React.FC = () => {
  /**
   * Tab state management:
   * - tabs: list of all open tabs
   * - setTabs: updater for open tabs
   * - activeTabId: ID of currently active tab
   * - setActiveTabId: updates active tab
   * - closedStack: recently closed tabs (LIFO)
   * - setClosedStack: updater for closed tabs stack
   */
  const {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
  } = useTabState();

  /**
   * Core tab logic handlers:
   * Provides openTab, closeTab, updateTab, and restoreLastClosed
   */
  const { openTab, closeTab, updateTab, restoreLastClosed } =
    createTabHandlersBundle({
      tabs,
      setTabs,
      activeTabId,
      setActiveTabId,
      closedStack,
      setClosedStack,
    });

  /**
   * Group tab logic:
   * Opens a new tab for a portlet group (parent group in sidebar)
   * Delegates to `openTab` from core
   */
  const { openGroupTab } = createGroupTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
  });

  /**
   * Item tab logic:
   * Opens a new tab for a portlet/item (child in sidebar)
   * Delegates to `openTab` from core
   */
  const { openItemTab } = createItemTabHandlers({
    tabs,
    setActiveTabId,
    openTab,
  });

  /**
   * Favorite (pinned) tab logic:
   * Toggles favorite/pinned state of a tab
   */
  const { toggleFavorite } = createFavoriteHandlers({
    tabs,
    updateTab,
  });

  /**
   * Main layout rendering:
   * SidebarArea receives handlers to open tabs
   * ContentArea receives tab state and tab control handlers
   */
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
