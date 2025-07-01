"use client";

import React from "react";
import styles from "./ContentHeader.module.css";
import { X, RotateCcw, Trash2 } from "lucide-react"; // Lucide icons

export type SortMode = "default" | "asc" | "desc";

interface ContentHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  onCloseAllTabs: () => void;
  onRestoreTab: () => void;
}

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
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tabs..."
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            className={styles.clearBtn}
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <select
        className={styles.sortSelect}
        value={sortMode}
        onChange={(e) => onSortModeChange(e.target.value as SortMode)}
      >
        <option value="default">Click Order</option>
        <option value="asc">Sort A–Z</option>
        <option value="desc">Sort Z–A</option>
      </select>

      <button className={styles.iconBtn} onClick={onRestoreTab}>
        <RotateCcw size={16} />
        Restore
      </button>

      <button className={styles.iconBtn} onClick={onCloseAllTabs}>
        <Trash2 size={16} />
        Close All
      </button>
    </div>
  );
};

export default ContentHeader;
