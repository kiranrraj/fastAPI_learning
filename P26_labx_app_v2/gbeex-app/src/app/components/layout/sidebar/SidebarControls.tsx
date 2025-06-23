// src/app/components/sidebar/SidebarControls.tsx

"use client";

import React from "react";
import styles from "./SidebarControls.module.css";

interface SidebarControlsProps {
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

/**
 * SidebarControls
 * ---------------
 * Contains sort, expand all, collapse all controls.
 */
const SidebarControls: React.FC<SidebarControlsProps> = ({
  sortOrder,
  onToggleSortOrder,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className={styles.controlsWrapper}>
      <button className={styles.controlButton} onClick={onToggleSortOrder}>
        Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </button>
      <button className={styles.controlButton} onClick={onExpandAll}>
        Expand All
      </button>
      <button className={styles.controlButton} onClick={onCollapseAll}>
        Collapse All
      </button>
    </div>
  );
};

export default SidebarControls;
