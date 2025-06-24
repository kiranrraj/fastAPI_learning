// src/app/components/layout/sidebar/SidebarContainer.tsx

import React, { useState, useMemo } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarHeader from "./SidebarHeader";
import SidebarContentArea from "./SidebarContentArea";
import SidebarFavoritesSection from "./SidebarFavoriteSection";
import { sortPortlets } from "@/app/utils/sidebar/sortHandler";
import { filterAndExpandNodes } from "@/app/utils/sidebar/searchHandler";
import { handleFavoriteToggleWithLimit } from "@/app/utils/sidebar/favoriteHandler";

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
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleExpandAll = () => {
    setExpandAllCounter((prev) => prev + 1);
  };

  const handleCollapseAll = () => {
    setCollapseAllCounter((prev) => prev + 1);
  };

  const handleToggleFavorite = (id: string) => {
    const { updatedFavorites } = handleFavoriteToggleWithLimit(favorites, id);
    setFavorites(updatedFavorites);
  };

  const { filteredNodes, autoExpandedGroups } = useMemo(() => {
    return query.trim()
      ? filterAndExpandNodes(portletData, query)
      : {
          filteredNodes: portletData,
          autoExpandedGroups: {},
        };
  }, [portletData, query]);

  const sorted = useMemo(
    () => sortPortlets(filteredNodes, sortOrder),
    [filteredNodes, sortOrder]
  );

  const favoriteItems = useMemo(
    () => portletData.filter((node) => favorites[node.id]),
    [portletData, favorites]
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

      <SidebarFavoritesSection
        favorites={favoriteItems}
        query={query}
        onToggleFavorite={handleToggleFavorite}
        onItemClick={onItemClick}
        highlight={(name) => name}
      />

      <SidebarContentArea
        data={sorted}
        query={query}
        autoExpandedGroups={autoExpandedGroups}
        expandAllTrigger={expandAllCounter}
        collapseAllTrigger={collapseAllCounter}
        favorites={favorites}
        onItemClick={onItemClick}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default SidebarContainer;
