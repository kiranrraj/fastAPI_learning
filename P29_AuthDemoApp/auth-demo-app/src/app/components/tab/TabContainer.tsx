// src\app\components\tab\TabContainer.tsx

"use client";

import styles from "./TabContainer.module.css";
import { TabContainerProps } from "./tabs.types";
import TabItem from "./TabItem";
import TabContent from "./TabContent";

/**
 * Renders a horizontal list of tab headers and the corresponding content of the active tab.
 *
 * Props:
 * - tabs: Tab[] – all tab objects
 * - onTabSelect: function to call when a tab is selected
 * - onTabClose: function to call when a tab is closed
 * - onTabToggleFavorite: optional function to toggle favorite state
 * - onTabToggleLock: optional function to toggle lock state
 */
export default function TabContainer({
  tabs,
  onTabSelect,
  onTabClose,
  onTabToggleFavorite,
  onTabToggleLock,
}: TabContainerProps) {
  const activeTab = tabs.find((tab) => tab.isActive);

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeaderList}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            {...tab}
            onSelect={onTabSelect}
            onClose={onTabClose}
            onToggleFavorite={onTabToggleFavorite}
            onToggleLock={onTabToggleLock}
          />
        ))}
      </div>

      <div className={styles.tabContentArea}>
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
