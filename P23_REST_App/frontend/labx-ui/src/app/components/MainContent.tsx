// src/app/components/MainContent.tsx

"use client";

import { useState, useEffect } from "react";
import { Tab } from "../types/tabTypes";
import styles from "./MainContent.module.css";
import TabRenderer from "../utils/tab/TabRenderer";

interface MainContentProps {
  openTabs: Tab[];
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const MainContent = ({ openTabs, setOpenTabs }: MainContentProps) => {
  const [activeTabId, setActiveTabId] = useState<string | null>(
    openTabs.length > 0 ? openTabs[0].id : null
  );

  // Keep active tab updated when tabs change
  useEffect(() => {
    // Remove focus if active tab is closed
    if (activeTabId && !openTabs.find((t) => t.id === activeTabId)) {
      setActiveTabId(openTabs.length > 0 ? openTabs[0].id : null);
    }

    // Focus newly added tab
    if (
      openTabs.length > 0 &&
      activeTabId !== openTabs[openTabs.length - 1].id
    ) {
      setActiveTabId(openTabs[openTabs.length - 1].id);
    }
  }, [openTabs]);

  const closeTab = (tabId: string) => {
    const index = openTabs.findIndex((t) => t.id === tabId);
    const updatedTabs = openTabs.filter((t) => t.id !== tabId);
    setOpenTabs(updatedTabs);

    if (tabId === activeTabId) {
      if (updatedTabs.length > 0) {
        const nextTab =
          updatedTabs[index] || updatedTabs[updatedTabs.length - 1];
        setActiveTabId(nextTab.id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Tab Headers */}
      <div className={styles.tabHeader}>
        {openTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`${styles.tabButton} ${
              activeTabId === tab.id ? styles.active : ""
            }`}
          >
            <span className={styles.tabTitle}>{tab.title}</span>
            <span
              className={styles.closeButton}
              role="button"
              tabIndex={0}
              aria-label={`Close tab ${tab.title}`}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  closeTab(tab.id);
                }
              }}
            >
              ×
            </span>
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className={styles.tabBody}>
        {openTabs.length === 0 && (
          <div className={styles.emptyState}>
            No tabs open. Please select from the sidebar.
          </div>
        )}

        {openTabs.map((tab) =>
          tab.id === activeTabId ? (
            <div key={tab.id} className={styles.tabPanel}>
              <TabRenderer tab={tab} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default MainContent;
