// src/app/components/layout/base/MainSection.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MainSection.module.css";
import SidebarContainer from "@/app/components/layout/sidebar/SidebarContainer";
import ContentArea from "@/app/components/layout/content/ContentArea";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";
import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * MainSection
 * --------------------
 * This is the core layout manager for:
 * - Fetching portlet data
 * - Opening/closing tabs
 * - Initializing default tab
 * - Handling active tab logic and restoration
 */
const MainSection: React.FC = () => {
  const [portletData, setPortletData] = useState<PortletNode[]>([]);
  const [tabs, setTabs] = useState<Record<string, PortletNode>>({});
  const [tabOrder, setTabOrder] = useState<string[]>([]);
  const [closedTabsStack, setClosedTabsStack] = useState<PortletNode[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  // API payload for loading all groups with children
  const payload = useMemo(
    () => ({
      params: [{ include_children: true, limit: 10, skip: 0 }],
    }),
    []
  );

  const { data, loading, error } = useAPICall(
    "http://localhost:8000/labx/entity/InvestigationGroup/list",
    payload,
    []
  );

  // Define default tab (acts as a dashboard)
  const defaultTabNode: PortletNode = {
    id: "__default__",
    name: "Dashboard",
    type: "default",
    parentIds: [],
    meta: {
      viewMode: "default",
    },
  };

  // Load and transform API data
  useEffect(() => {
    if (data) {
      const transformed = transformToPortletNodes(data);
      setPortletData(transformed);

      // On first load, initialize default tab if none is open
      setTabs((prev) => {
        if (!prev["__default__"]) {
          return { ...prev, ["__default__"]: defaultTabNode };
        }
        return prev;
      });

      setTabOrder((prev) => {
        if (!prev.includes("__default__")) {
          return [...prev, "__default__"];
        }
        return prev;
      });

      setActiveTabId((prev) => prev || "__default__");
    }
  }, [data]);

  /**
   * Open a new tab or focus if already open
   */
  /** Open a new tab and auto-remove the default tab if active */
  const openTab = (node: PortletNode) => {
    // Update tabs
    setTabs((prev) => {
      // If already open, just focus it
      if (prev[node.id]) {
        setActiveTabId(node.id);
        return prev;
      }

      // Clone existing tabs and add the new one
      const updatedTabs = { ...prev, [node.id]: node };

      // Auto-close the default tab if it's open
      if (prev["__default__"]) {
        delete updatedTabs["__default__"];
      }

      return updatedTabs;
    });

    // Update tab order
    setTabOrder((prev) => {
      const newOrder = prev.filter((id) => id !== "__default__");
      return newOrder.includes(node.id) ? newOrder : [...newOrder, node.id];
    });

    // Set active tab to the new one
    setActiveTabId(node.id);
  };

  /**
   * Close a tab and optionally switch focus
   */
  const closeTab = (tabId: string) => {
    setTabs((prev) => {
      const updated = { ...prev };
      const closedTab = updated[tabId];
      delete updated[tabId];

      if (closedTab) {
        setClosedTabsStack((prev) => [closedTab, ...prev]);
      }

      return updated;
    });

    setTabOrder((prev) => prev.filter((id) => id !== tabId));

    // Adjust focus to last tab in order or empty
    setActiveTabId((prevActive) =>
      prevActive === tabId
        ? tabOrder.filter((id) => id !== tabId).slice(-1)[0] || ""
        : prevActive
    );
  };

  /**
   * Restore the most recently closed tab
   */
  const restoreLastClosedTab = () => {
    if (closedTabsStack.length === 0) return;
    const [lastClosed, ...rest] = closedTabsStack;
    setClosedTabsStack(rest);
    openTab(lastClosed);
  };

  // Fallback states
  if (loading) return <div className={styles.mainSection}>Loading...</div>;
  if (error) return <div className={styles.mainSection}>Error: {error}</div>;

  return (
    <main className={styles.mainSection}>
      <div className={styles.sidebar}>
        <SidebarContainer portletData={portletData} onItemClick={openTab} />
      </div>
      <div className={styles.content}>
        <ContentArea
          tabs={Object.fromEntries(tabOrder.map((id) => [id, tabs[id]]))}
          activeTabId={activeTabId}
          portletData={portletData}
          onCloseTab={closeTab}
          onTabClick={setActiveTabId}
          onRestoreLastTab={restoreLastClosedTab}
        />
      </div>
    </main>
  );
};

export default MainSection;
