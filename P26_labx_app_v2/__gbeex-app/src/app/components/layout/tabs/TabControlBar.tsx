// src/app/components/layout/tabs/TabControlBar.tsx

"use client";

import React, { useState } from "react";
import { TabMeta } from "@/app/types/tab.types";

interface TabControlBarProps {
  tabs: TabMeta[];
  onSearch: (text: string) => void;
  onSort: (criteria: "asc" | "desc" | "favorite") => void;
  onRestoreLastClosed: () => void;
  onCloseAllTabs: () => void;
  onResetFavorites: () => void;
}

const TabControlBar: React.FC<TabControlBarProps> = ({
  tabs,
  onSearch,
  onSort,
  onRestoreLastClosed,
  onCloseAllTabs,
  onResetFavorites,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "asc" | "desc" | "favorite";
    onSort(value);
  };

  return (
    <div className="flex gap-2 items-center mb-2 px-2 py-1 border rounded-md bg-muted">
      <input
        type="text"
        placeholder="Search tabs..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="px-2 py-1 text-sm border rounded w-40"
        aria-label="Search tabs"
      />

      <select
        onChange={handleSortChange}
        className="px-2 py-1 text-sm border rounded"
        defaultValue=""
        aria-label="Sort tabs"
      >
        <option value="" disabled>
          Sort Tabs
        </option>
        <option value="asc">Title A-Z</option>
        <option value="desc">Title Z-A</option>
        <option value="favorite">Favorites</option>
      </select>

      <button
        onClick={onRestoreLastClosed}
        className="text-sm border rounded px-2 py-1"
        aria-label="Restore last closed tab"
      >
        Restore Last
      </button>

      <button
        onClick={onCloseAllTabs}
        className="text-sm border rounded px-2 py-1"
        aria-label="Close all tabs"
      >
        Close All
      </button>

      <button
        onClick={onResetFavorites}
        className="text-sm border rounded px-2 py-1"
        aria-label="Reset favorites"
      >
        Reset Favorites
      </button>
    </div>
  );
};

export default React.memo(TabControlBar);
