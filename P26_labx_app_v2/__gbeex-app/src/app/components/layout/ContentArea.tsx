"use client";

import React from "react";
import styles from "@/app/components/styles/content/ContentArea.module.css";
import { TabMap } from "@/app/types/tab.types";
import { PortletGroup } from "@/app/types/sidebar.types";
import TabContainer from "@/app/components/layout/tabs/TabContainer";
import TabDefaultView from "@/app/components/layout/tabs/TabDefaultView";

/**
 * ContentArea Component
 *
 * This component is the right-hand side view that displays tabbed content.
 * When no tab is active, it displays a default view showing all available groups/items.
 *
 * Props:
 * - tabs: A map of all open tabs.
 * - activeTabId: The currently focused tab.
 * - onTabClick: Function to focus a tab.
 * - onTabClose: Function to close a tab.
 * - onToggleFavorite: Function to favorite/unfavorite a tab.
 * - groupData: Data for default tab view (same as sidebar).
 * - className: Optional custom CSS classes.
 *
 * Behavior:
 * - If no tab is active, show default group/item card view.
 * - If a tab is active, show its content using the TabContainer.
 */
interface ContentAreaProps {
  tabs: TabMap;
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onToggleFavorite: (tabId: string) => void;
  groupData: PortletGroup[];
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
  const tabList = Object.values(tabs); // Convert TabMap to array for rendering

  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden ${styles.contentArea} ${className}`}
      role="main"
      aria-label="Main content"
    >
      {/* Show Default View when no tab is active */}
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
