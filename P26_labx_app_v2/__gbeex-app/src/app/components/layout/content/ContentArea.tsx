"use client";

import React from "react";
import styles from "@/app/components/styles/content/ContentArea.module.css";
import { TabMap } from "@/app/types/tab.types";
import { PortletGroup } from "@/app/types/sidebar.types";

import TabContainer from "@/app/components/layout/tabs/TabContainer";
import TabDefaultView from "@/app/components/layout/tabs/TabDefaultView";

interface ContentAreaProps {
  tabs: TabMap;
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onToggleFavorite: (tabId: string) => void;
  groupData: PortletGroup[]; // Shared with Sidebar
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onToggleFavorite,
  groupData,
  className = "",
}) => {
  const tabList = Object.values(tabs);

  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden ${styles.contentArea} ${className}`}
      role="main"
      aria-label="Main content"
    >
      {activeTabId === null ? (
        <TabDefaultView groups={groupData} onPortletClick={onTabClick} />
      ) : (
        <TabContainer
          tabs={tabList}
          activeTabId={activeTabId}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
          onToggleFavorite={onToggleFavorite}
          renderTabContent={(tab) => (
            <div className="p-4">
              <h2 className="text-xl font-semibold">{tab.title}</h2>
              <pre className="text-xs text-muted-foreground mt-2">
                {JSON.stringify(tab.data, null, 2)}
              </pre>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default React.memo(ContentArea);
