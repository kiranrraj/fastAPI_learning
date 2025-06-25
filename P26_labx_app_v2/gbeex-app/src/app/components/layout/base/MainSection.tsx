"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MainSection.module.css";
import SidebarContainer from "@/app/components/layout/sidebar/SidebarContainer";
import ContentArea from "@/app/components/layout/content/ContentArea";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";
import { PortletNode } from "@/app/types/common/portlet.types";
import Spinner from "@/app/components/layout/base/Spinner";
import ErrorView from "@/app/components/layout/base/ErrorView";

/**
 * MainSection
 * -----------
 * Core layout component managing:
 * - API data fetching and transformation
 * - Tab management (open, close, restore)
 * - Active tab state
 * - Displaying loading, error, or main content states
 *
 * Debugging:
 * - Use console.groupCollapsed logs for props and state insights (can be toggled on/off)
 */
const MainSection: React.FC = () => {
  // Local state for portlet nodes fetched and transformed from API
  const [portletData, setPortletData] = useState<PortletNode[]>([]);

  // Tabs open in the content area, keyed by node ID
  const [tabs, setTabs] = useState<Record<string, PortletNode>>({});

  // Order of tabs for consistent display
  const [tabOrder, setTabOrder] = useState<string[]>([]);

  // Stack for recently closed tabs to support restoration
  const [closedTabsStack, setClosedTabsStack] = useState<PortletNode[]>([]);

  // Currently active tab ID
  const [activeTabId, setActiveTabId] = useState<string>("");

  // API request payload - fetch groups with children, limited for demo
  const payload = useMemo(
    () => ({
      params: [{ include_children: true, limit: 10, skip: 0 }],
    }),
    []
  );

  // Use custom hook to POST and fetch data
  const { data, loading, error } = useAPICall(
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

  // Effect: On receiving data, transform and initialize tabs
  useEffect(() => {
    if (data) {
      // Transform API raw data into PortletNode format
      const transformed = transformToPortletNodes(data);
      setPortletData(transformed);

      // Add default tab if not already present
      setTabs((prev) => {
        if (!prev["__default__"]) {
          return { ...prev, ["__default__"]: defaultTabNode };
        }
        return prev;
      });

      // Add default tab to order if not present
      setTabOrder((prev) => {
        if (!prev.includes("__default__")) {
          return [...prev, "__default__"];
        }
        return prev;
      });

      // Set active tab to default if none selected
      setActiveTabId((prev) => prev || "__default__");
    }
  }, [data]);

  // Debugging: Log key states when they change
  useEffect(() => {
    // Comment this out to disable debug logs
    console.groupCollapsed("[MainSection Debug]");
    console.log("portletData:", portletData);
    console.log("tabs:", tabs);
    console.log("tabOrder:", tabOrder);
    console.log("activeTabId:", activeTabId);
    console.groupEnd();
  }, [portletData, tabs, tabOrder, activeTabId]);

  /**
   * Open a new tab or focus existing tab
   * - Removes default tab if present to focus user on specific content
   */
  const openTab = (node: PortletNode) => {
    setTabs((prev) => {
      // If tab already open, just focus it
      if (prev[node.id]) {
        setActiveTabId(node.id);
        return prev;
      }

      // Clone tabs and add new tab
      const updatedTabs = { ...prev, [node.id]: node };

      // Remove default tab if present to avoid clutter
      if (prev["__default__"]) {
        delete updatedTabs["__default__"];
      }

      return updatedTabs;
    });

    setTabOrder((prev) => {
      // Remove default tab id from order
      const filtered = prev.filter((id) => id !== "__default__");
      return filtered.includes(node.id) ? filtered : [...filtered, node.id];
    });

    // Set newly opened tab as active
    setActiveTabId(node.id);
  };

  /**
   * Close a tab
   * - Removes tab from open tabs
   * - Pushes closed tab to stack for potential restoration
   * - Updates active tab appropriately
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

    // Focus fallback: last tab in order or empty string if none
    setActiveTabId((prevActive) =>
      prevActive === tabId
        ? tabOrder.filter((id) => id !== tabId).slice(-1)[0] || ""
        : prevActive
    );
  };

  /**
   * Restore the last closed tab from the stack
   */
  const restoreLastClosedTab = () => {
    if (closedTabsStack.length === 0) return;

    const [lastClosed, ...rest] = closedTabsStack;
    setClosedTabsStack(rest);
    openTab(lastClosed);
  };

  // Render loading spinner inside main section
  if (loading) {
    return (
      <main className={styles.mainSection}>
        <div className={styles.loadingWrapper} aria-label="Loading content">
          <Spinner />
        </div>
      </main>
    );
  }

  // Render error view on API failure
  if (error) {
    return (
      <main className={styles.mainSection}>
        <ErrorView
          message={error.message || String(error)}
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  // Main render
  return (
    <main className={styles.mainSection}>
      {/* Sidebar panel */}
      <section className={styles.sidebar}>
        <SidebarContainer portletData={portletData} onItemClick={openTab} />
      </section>

      {/* Content panel */}
      <section className={styles.content}>
        <ContentArea
          tabs={Object.fromEntries(tabOrder.map((id) => [id, tabs[id]]))}
          activeTabId={activeTabId}
          portletData={portletData}
          onCloseTab={closeTab}
          onTabClick={setActiveTabId}
          onRestoreLastTab={restoreLastClosedTab}
        />
      </section>
    </main>
  );
};

export default MainSection;
