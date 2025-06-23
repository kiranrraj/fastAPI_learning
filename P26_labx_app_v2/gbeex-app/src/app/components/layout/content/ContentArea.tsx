// src/app/components/layout/content/ContentArea.tsx

"use client";

import React, { useMemo, useState } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import GroupContentView from "./views/GroupContentView";
import ItemContentView from "./views/ItemContentView";
import ContentHeader from "./ContentHeader";
import styles from "./ContentArea.module.css";

/**
 * Props for ContentArea
 */
interface ContentAreaProps {
  tabs: Record<string, PortletNode>;
  activeTabId: string;
  portletData: PortletNode[];
  onCloseTab: (tabId: string) => void;
  onTabClick: (tabId: string) => void;
  onRestoreLastTab: () => void;
}

/**
 * ContentArea renders:
 * - Header with tab controls
 * - List of open tabs
 * - Active tab content
 */
const ContentArea: React.FC<ContentAreaProps> = ({
  tabs,
  activeTabId,
  portletData,
  onCloseTab,
  onTabClick,
  onRestoreLastTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"default" | "asc" | "desc">(
    "default"
  );

  const portletMap = useMemo(() => {
    return portletData.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, PortletNode>);
  }, [portletData]);

  const tabEntries = useMemo(() => {
    let entries = Object.entries(tabs);
    if (sortMode === "asc") {
      entries.sort(([, a], [, b]) => a.name.localeCompare(b.name));
    } else if (sortMode === "desc") {
      entries.sort(([, a], [, b]) => b.name.localeCompare(a.name));
    } // default = insertion order

    return entries.filter(([, node]) =>
      node.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tabs, searchQuery, sortMode]);

  const activeTab = tabs[activeTabId];

  return (
    <div className={styles.contentAreaWrapper}>
      {/* Header with Search, Sort, Restore, Close All */}
      <ContentHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortMode={sortMode}
        onSortModeChange={(mode) => setSortMode(mode)}
        onCloseAllTabs={() => Object.keys(tabs).forEach(onCloseTab)}
        onRestoreTab={onRestoreLastTab}
      />

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        {tabEntries.map(([tabId, node]) => (
          <div
            key={tabId}
            className={`${styles.tabItem} ${
              tabId === activeTabId ? styles.activeTab : ""
            }`}
            onClick={() => onTabClick(tabId)}
          >
            <span className={styles.tabName}>{node.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tabId);
              }}
              className={styles.tabCloseButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContentArea}>
        {!activeTab && (
          <div className={styles.emptyTabMessage}>No tab selected</div>
        )}
        {activeTab?.type === "group" && (
          <GroupContentView groupNode={activeTab} allNodes={portletMap} />
        )}
        {activeTab?.type === "item" && <ItemContentView itemNode={activeTab} />}
      </div>
    </div>
  );
};

export default ContentArea;
