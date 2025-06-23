// src/app/components/layout/tabs/TabControlBar.tsx

"use client";

import React, { useState } from "react";
import { TabMeta } from "@/app/types/tab.types";

interface TabControlBarProps {
  tabs: TabMeta[]; // Array of visible tabs
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);

    // Debug
    console.log("[TabControlBar] Search input:", value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "asc" | "desc" | "favorite";
    onSort(value);

    // Debug
    console.log("[TabControlBar] Sort selected:", value);
  };

  return (
    <div className="flex gap-2 items-center mb-2 px-2 py-1 border rounded-md bg-muted">
      <input
        type="text"
        placeholder="Search tabs..."
        value={searchTerm}
        onChange={handleInputChange}
        className="px-2 py-1 text-sm border rounded w-40"
      />

      <select
        onChange={handleSortChange}
        className="px-2 py-1 text-sm border rounded"
        defaultValue=""
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
      >
        Restore Last
      </button>

      <button
        onClick={onCloseAllTabs}
        className="text-sm border rounded px-2 py-1"
      >
        Close All
      </button>

      <button
        onClick={onResetFavorites}
        className="text-sm border rounded px-2 py-1"
      >
        Reset Favorites
      </button>
    </div>
  );
};

export default React.memo(TabControlBar);
