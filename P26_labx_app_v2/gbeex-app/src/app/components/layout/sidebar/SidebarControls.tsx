"use client";

import React from "react";
import styles from "./SidebarControls.module.css";
import IconChevronUp from "@/app/components/icons/IconChevronUp";
import IconChevronDown from "@/app/components/icons/IconChevronDown";

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
        {sortOrder === "asc" ? "AZ" : "ZA"}
      </button>
      <button className={styles.controlButton} onClick={onExpandAll}>
        <IconChevronDown />
      </button>
      <button className={styles.controlButton} onClick={onCollapseAll}>
        <IconChevronUp />
      </button>
    </div>
  );
};

export default SidebarControls;
