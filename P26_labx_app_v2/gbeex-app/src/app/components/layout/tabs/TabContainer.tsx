// src/app/components/layout/tabs/TabContainer.tsx

import React from "react";
import { TabType } from "@/app/types/tab.types";
import TabHeaderBar from "./TabHeaderBar";

export interface TabContainerProps {
  tabs: TabType[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onToggleFavorite: (tabId: string) => void;
  renderTabContent: (tab: TabType) => React.ReactNode;
}

const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onToggleFavorite,
  renderTabContent,
}) => {
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-full">
      <TabHeaderBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex-1 overflow-auto border rounded-md mt-2 bg-background p-4">
        {activeTab ? (
          renderTabContent(activeTab)
        ) : (
          <div className="text-sm text-muted-foreground">No active tab.</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TabContainer);
