// src\app\components\tab\TabContent.tsx

"use client";

import { TabContentProps } from "@/app/types/tab.types";
import styles from "./TabContent.module.css";

// Displays the content of the currently active tab.
export default function TabContent({ activeTab }: TabContentProps) {
  if (!activeTab) {
    return (
      <div className={styles.emptyState}>
        <p>No tab selected. Please choose a tab to view its content.</p>
      </div>
    );
  }

  return <div className={styles.contentArea}>{activeTab.content}</div>;
}
