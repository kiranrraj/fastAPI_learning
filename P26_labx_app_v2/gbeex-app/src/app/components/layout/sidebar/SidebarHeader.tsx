// src/app/components/sidebar/SidebarHeader.tsx

"use client";

import React from "react";
import styles from "./SidebarHeader.module.css";
import SidebarSearch from "./SidebarSearch";
import SidebarControls from "./SidebarControls";
// Removed SidebarFavoritesSection import

/**
 * Props from parent (SidebarContainer) to sync state
 */
interface SidebarHeaderProps {
  query: string;
  setQuery: (value: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

/**
 * SidebarHeader
 * -------------
 * Top section of the sidebar:
 * - Title
 * - Search input (controlled)
 * - Controls (sort, expand/collapse)
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  query,
  setQuery,
  sortOrder,
  onToggleSortOrder,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Portlets</h2>
      <SidebarSearch query={query} setQuery={setQuery} />
      <SidebarControls
        sortOrder={sortOrder}
        onToggleSortOrder={onToggleSortOrder}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />
    </div>
  );
};

export default SidebarHeader;
