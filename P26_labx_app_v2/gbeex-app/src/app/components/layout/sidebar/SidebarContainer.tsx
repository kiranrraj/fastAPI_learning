// src/app/components/layout/sidebar/SidebarContainer.tsx

"use client";

import React, { useState, useMemo } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarHeader from "./SidebarHeader";
import SidebarContentArea from "./SidebarContentArea";
import { sortPortlets } from "@/app/utils/sidebar/sortHandler";
import { filterAndExpandNodes } from "@/app/utils/sidebar/searchHandler";

export interface SidebarContainerProps {
  portletData: PortletNode[];
  onItemClick: (node: PortletNode) => void;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  portletData,
  onItemClick,
}) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandAllCounter, setExpandAllCounter] = useState(0);
  const [collapseAllCounter, setCollapseAllCounter] = useState(0);

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleExpandAll = () => {
    setExpandAllCounter((prev) => prev + 1);
  };

  const handleCollapseAll = () => {
    setCollapseAllCounter((prev) => prev + 1);
  };

  const { filteredNodes, autoExpandedGroups } = useMemo(
    () => filterAndExpandNodes(portletData, query),
    [portletData, query]
  );

  const sorted = useMemo(
    () => sortPortlets(filteredNodes, sortOrder),
    [filteredNodes, sortOrder]
  );

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <SidebarHeader
        query={query}
        setQuery={setQuery}
        sortOrder={sortOrder}
        onToggleSortOrder={handleToggleSortOrder}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />
      <SidebarContentArea
        data={sorted}
        query={query}
        autoExpandedGroups={autoExpandedGroups}
        expandAllTrigger={expandAllCounter}
        collapseAllTrigger={collapseAllCounter}
        onItemClick={onItemClick}
      />
    </div>
  );
};

export default SidebarContainer;
