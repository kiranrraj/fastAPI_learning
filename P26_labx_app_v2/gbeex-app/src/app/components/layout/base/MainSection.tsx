// src/app/components/layout/base/MainSection.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MainSection.module.css";
import SidebarContainer from "@/app/components/layout/sidebar/SidebarContainer";
import ContentArea from "@/app/components/layout/content/ContentArea";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";
import { PortletNode } from "@/app/types/common/portlet.types";
import Spinner from "@/app/components/layout/base/Spinner";
import Footer from "@/app/components/layout/base/Footer";

/**
 * MainSection
 * -----------
 * Core layout component managing:
 * - API data fetching and transformation
 * - Tab management (open, close, restore)
 * - Active tab state
 * - Displaying loading, error, or main content states
 * - Server status and last refresh tracking
 */
const MainSection: React.FC = () => {
  // State: raw portlet data after API and transform
  const [portletData, setPortletData] = useState<PortletNode[]>([]);

  // Tabs open in the content area, keyed by node ID
  const [tabs, setTabs] = useState<Record<string, PortletNode>>({});

  // Order of tabs for consistent display
  const [tabOrder, setTabOrder] = useState<string[]>([]);

  // Stack for recently closed tabs to support restoration
  const [closedTabsStack, setClosedTabsStack] = useState<PortletNode[]>([]);

  // Currently active tab ID
  const [activeTabId, setActiveTabId] = useState<string>("");

  // Timestamp for last successful data refresh
  const [lastRefresh, setLastRefresh] = useState<number | undefined>(undefined);

  // Server status indicator: 'online', 'offline', or 'unknown'
  const [serverStatus, setServerStatus] = useState<
    "online" | "offline" | "unknown"
  >("unknown");

  // API request payload - fetch groups with children, limited for demo
  const payload = useMemo(
    () => ({
      params: [{ include_children: true, limit: 10, skip: 0 }],
    }),
    []
  );

  // Custom hook to POST and fetch data
  const { data, loading, error, refresh } = useAPICall(
    "http://localhost:8000/labx/entity/InvestigationGroup/list",
    payload,
    []
  );

  // Default tab representing the dashboard / default view
  const defaultTabNode: PortletNode = {
    id: "__default__",
    name: "Dashboard",
    type: "default",
    parentIds: [],
    meta: {
      viewMode: "default",
    },
  };

  // Effect: On receiving data, transform and initialize tabs & update status
  useEffect(() => {
    if (data) {
      const transformed = transformToPortletNodes(data);
      setPortletData(transformed);

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

      setLastRefresh(Date.now());
      setServerStatus("online");
    }
    if (error) {
      setServerStatus("offline");
    }
  }, [data, error]);

  // Debugging logs - comment out to disable
  useEffect(() => {
    console.groupCollapsed("[MainSection Debug]");
    console.log("portletData:", portletData);
    console.log("tabs:", tabs);
    console.log("tabOrder:", tabOrder);
    console.log("activeTabId:", activeTabId);
    console.log("serverStatus:", serverStatus);
    console.groupEnd();
  }, [portletData, tabs, tabOrder, activeTabId, serverStatus]);

  // Opens a new tab or focuses existing, removing default tab if needed
  const openTab = (node: PortletNode) => {
    setTabs((prev) => {
      if (prev[node.id]) {
        setActiveTabId(node.id);
        return prev;
      }

      const updatedTabs = { ...prev, [node.id]: node };

      if (prev["__default__"]) {
        delete updatedTabs["__default__"];
      }

      return updatedTabs;
    });

    setTabOrder((prev) => {
      const filtered = prev.filter((id) => id !== "__default__");
      return filtered.includes(node.id) ? filtered : [...filtered, node.id];
    });

    setActiveTabId(node.id);
  };

  // Close a tab, update stack, and focus fallback tab
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

    setActiveTabId((prevActive) =>
      prevActive === tabId
        ? tabOrder.filter((id) => id !== tabId).slice(-1)[0] || ""
        : prevActive
    );
  };

  // Restore the most recently closed tab
  const restoreLastClosedTab = () => {
    if (closedTabsStack.length === 0) return;
    const [lastClosed, ...rest] = closedTabsStack;
    setClosedTabsStack(rest);
    openTab(lastClosed);
  };

  // Manual refresh handler - calls refetch from useAPICall
  const handleManualRefresh = () => {
    setServerStatus("unknown");
    refresh?.();
  };

  // Loading state with spinner
  if (loading) {
    return (
      <main className={styles.mainSection}>
        <div className={styles.loadingWrapper} aria-label="Loading content">
          <Spinner />
        </div>
      </main>
    );
  }

  // Error state with message and retry button
  if (error) {
    return (
      <main className={styles.mainSection}>
        <div className={styles.errorMessage} role="alert">
          Error loading data: {error.message || String(error)}
          <button onClick={handleManualRefresh} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  // Main render
  return (
    <>
      <main className={styles.mainSection}>
        {/* Sidebar panel with manual refresh button */}
        <section className={styles.sidebar}>
          <SidebarContainer onItemClick={openTab} />
        </section>

        {/* Content panel */}
        <ContentArea
          tabs={Object.fromEntries(tabOrder.map((id) => [id, tabs[id]]))}
          activeTabId={activeTabId}
          portletData={portletData}
          onCloseTab={closeTab}
          onTabClick={setActiveTabId}
          onRestoreLastTab={restoreLastClosedTab}
        />
      </main>

      {/* Footer with last refresh and server status */}
      <Footer lastRefreshTimestamp={lastRefresh} serverStatus={serverStatus} />
    </>
  );
};

export default MainSection;
