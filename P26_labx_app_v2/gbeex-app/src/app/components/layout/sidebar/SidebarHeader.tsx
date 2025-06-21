// Updated SidebarHeader.tsx (favorites button removed)
"use client";

import React from "react";
import SidebarSearch from "./SidebarSearch";
import SidebarButtonGroup from "./SidebarButtonGroup";
import { SidebarHeaderProps } from "@/app/types/sidebar.types";

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  expanded,
  setExpanded,
  onExpandAll,
  onCollapseAll,
}) => {
  const handleToggle = (key: "sort" | "expanded") => {
    switch (key) {
      case "sort":
        setSortOrder(sortOrder === "az" ? "za" : "az");
        break;
      case "expanded":
        setExpanded(!expanded);
        break;
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        Investigation Groups
      </h2>

      <SidebarSearch
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      <SidebarButtonGroup
        states={{ sort: sortOrder, expanded }}
        onToggle={handleToggle}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />
    </div>
  );
};

export default React.memo(SidebarHeader);
