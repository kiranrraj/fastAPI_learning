"use client";

import React, { useMemo, useState } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import GroupContentView from "./views/GroupContentView";
import ItemContentView from "./views/ItemContentView";
import DefaultContentView from "./views/DefaultContentView";
import ContentHeader from "./ContentHeader";
import styles from "./ContentArea.module.css";
import { X } from "lucide-react";

interface ContentAreaProps {
  tabs: Record<string, PortletNode>;
  activeTabId: string;
  portletData: PortletNode[];
  onCloseTab: (tabId: string) => void;
  onTabClick: (tabId: string) => void;
  onRestoreLastTab: () => void;
}

/**
 * ContentArea
 * -----------
 * Manages the content display area including:
 * - Header (Search, Sort, Restore, Close All)
 * - Tab Bar
 * - Tab Content Renderer
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

  // Map of all portlets by ID for fast lookup
  const portletMap = useMemo(() => {
    return portletData.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, PortletNode>);
  }, [portletData]);

  // Prepare filtered + sorted tab list
  const tabEntries = useMemo(() => {
    let entries = Object.entries(tabs);

    if (sortMode === "asc") {
      entries.sort(([, a], [, b]) => a.name.localeCompare(b.name));
    } else if (sortMode === "desc") {
      entries.sort(([, a], [, b]) => b.name.localeCompare(a.name));
    }

    return entries.filter(([, node]) =>
      node.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tabs, searchQuery, sortMode]);

  // Determine the currently active tab node
  const activeTab = tabs[activeTabId];

  /**
   * Render the content associated with the active tab
   */
  const renderTabContent = (tab: PortletNode | undefined) => {
    if (!tab) {
      return (
        <div className={styles.noTabSelectedMessage}>
          <p>No tab selected.</p>
        </div>
      );
    }

    if (tab.id === "__default__") {
      return <DefaultContentView portletData={portletData} />;
    }

    if (tab.type === "group") {
      return <GroupContentView groupNode={tab} allNodes={portletMap} />;
    }

    if (tab.type === "item") {
      return <ItemContentView itemNode={tab} />;
    }

    return (
      <div className={styles.unknownTabMessage}>
        <p>Unsupported tab type.</p>
      </div>
    );
  };

  return (
    <div className={styles.contentAreaWrapper}>
      {/* Header with search, sorting, restore and close all */}
      <ContentHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        onCloseAllTabs={() => Object.keys(tabs).forEach(onCloseTab)}
        onRestoreTab={onRestoreLastTab}
      />

      {/* Tab bar: list of currently open tabs */}
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
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>

      {/* Tab content view */}
      <div className={styles.tabContentArea}>{renderTabContent(activeTab)}</div>
    </div>
  );
};

export default ContentArea;
