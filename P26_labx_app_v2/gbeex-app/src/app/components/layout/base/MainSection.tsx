// src/app/components/layout/base/MainSection.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import styles from "./MainSection.module.css";
import SidebarContainer from "@/app/components/layout/sidebar/SidebarContainer";
import ContentArea from "@/app/components/layout/content/ContentArea";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";
import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * MainSection
 * -----------
 * Manages:
 * - Data loading
 * - Tab opening/closing
 * - Restore last closed tab
 * - Tab click order
 */
const MainSection: React.FC = () => {
  const [portletData, setPortletData] = useState<PortletNode[]>([]);
  const [tabs, setTabs] = useState<Record<string, PortletNode>>({});
  const [tabOrder, setTabOrder] = useState<string[]>([]);
  const [closedTabsStack, setClosedTabsStack] = useState<PortletNode[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

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

  useEffect(() => {
    if (data) {
      const transformed = transformToPortletNodes(data);
      setPortletData(transformed);
    }
  }, [data]);

  /** Open tab and add to tab list + order */
  const openTab = (node: PortletNode) => {
    setTabs((prev) => {
      if (prev[node.id]) {
        setActiveTabId(node.id); // just focus if already open
        return prev;
      }

      return { ...prev, [node.id]: node };
    });

    setTabOrder((prev) => (prev.includes(node.id) ? prev : [...prev, node.id]));
    setActiveTabId(node.id);
  };

  /** Close tab and remember it */
  const closeTab = (tabId: string) => {
    setTabs((prev) => {
      const updated = { ...prev };
      const closed = updated[tabId];
      delete updated[tabId];

      if (closed) {
        setClosedTabsStack((prev) => [closed, ...prev]);
      }

      return updated;
    });

    setTabOrder((prev) => prev.filter((id) => id !== tabId));

    if (activeTabId === tabId) {
      const remaining = tabOrder.filter((id) => id !== tabId);
      setActiveTabId(remaining[remaining.length - 1] || "");
    }
  };

  /** Restore the most recently closed tab */
  const restoreLastClosedTab = () => {
    if (closedTabsStack.length === 0) return;

    const [lastClosed, ...rest] = closedTabsStack;
    setClosedTabsStack(rest);
    openTab(lastClosed);
  };

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
