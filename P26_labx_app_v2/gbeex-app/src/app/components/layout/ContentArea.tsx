// src/app/components/layout/ContentArea.tsx

import React from "react";
import styles from "@/app/components/styles/ContentArea.module.css";
import { TabType } from "@/app/types/tab.types";
import TabContainer from "../layout/tabs/TabContainer";

interface ContentAreaProps {
  tabs: TabType[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onToggleFavorite: (tabId: string) => void;
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onToggleFavorite,
  className = "",
}) => {
  return (
    <div
      className={`flex-1 p-4 overflow-auto ${styles.contentArea} ${className}`}
      role="main"
      aria-label="Main content"
    >
      <TabContainer
        tabs={tabs}
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
    </div>
  );
};

export default React.memo(ContentArea);
