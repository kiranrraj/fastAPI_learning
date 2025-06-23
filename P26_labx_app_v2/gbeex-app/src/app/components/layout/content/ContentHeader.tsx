// src/app/components/layout/content/ContentHeader.tsx

"use client";

import React from "react";
import styles from "./ContentHeader.module.css";

export type SortMode = "default" | "asc" | "desc";

interface ContentHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  onCloseAllTabs: () => void;
  onRestoreTab: () => void;
}

/**
 * ContentHeader
 * - Input for tab filtering
 * - Sort dropdown (default, A–Z, Z–A)
 * - Restore last tab
 * - Close all tabs
 */
const ContentHeader: React.FC<ContentHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  sortMode,
  onSortModeChange,
  onCloseAllTabs,
  onRestoreTab,
}) => {
  return (
    <div className={styles.headerContainer}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tabs..."
        className={styles.searchInput}
      />

      <select
        className={styles.sortSelect}
        value={sortMode}
        onChange={(e) => onSortModeChange(e.target.value as SortMode)}
      >
        <option value="default">Click Order</option>
        <option value="asc">Sort A–Z</option>
        <option value="desc">Sort Z–A</option>
      </select>

      <button className={styles.headerBtn} onClick={onRestoreTab}>
        Restore Tab
      </button>

      <button className={styles.headerBtn} onClick={onCloseAllTabs}>
        Close All
      </button>
    </div>
  );
};

export default ContentHeader;
