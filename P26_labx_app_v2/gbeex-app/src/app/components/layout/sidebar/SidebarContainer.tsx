"use client";

import React, { useState, useMemo } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarHeader from "./SidebarHeader";
import SidebarContentArea from "./SidebarContentArea";
import SidebarFavoritesSection from "./SidebarFavoriteSection";
import { sortPortlets } from "@/app/utils/sidebar/sortHandler";
import { filterAndExpandNodes } from "@/app/utils/sidebar/searchHandler";
import { handleFavoriteToggleWithLimit } from "@/app/utils/sidebar/favoriteHandler";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";

export interface SidebarContainerProps {
  onItemClick: (node: PortletNode) => void;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ onItemClick }) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandAllCounter, setExpandAllCounter] = useState(0);
  const [collapseAllCounter, setCollapseAllCounter] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFavLimitPopup, setShowFavLimitPopup] = useState(false);

  // API payload to fetch groups with children, limit for demo
  const payload = { params: [{ include_children: true, limit: 10, skip: 0 }] };

  // Fetch raw portlet data, with loading/error states and manual refresh
  const {
    data: portletDataRaw,
    loading,
    error,
    refresh,
  } = useAPICall(
    "http://localhost:8000/labx/entity/InvestigationGroup/list",
    payload,
    []
  );

  // Transform raw API data to PortletNode format for internal usage
  const portletData = useMemo(() => {
    if (!portletDataRaw) return [];
    return transformToPortletNodes(portletDataRaw);
  }, [portletDataRaw]);

  // Toggle sort order between ascending and descending
  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Increment expand and collapse counters to trigger all expand/collapse
  const handleExpandAll = () => setExpandAllCounter((c) => c + 1);
  const handleCollapseAll = () => setCollapseAllCounter((c) => c + 1);

  // Toggle favorite with limit enforcement
  const handleToggleFavorite = (id: string) => {
    const { updatedFavorites, showLimitWarning } =
      handleFavoriteToggleWithLimit(favorites, id);
    if (showLimitWarning) {
      setShowFavLimitPopup(true);
    }
    setFavorites(updatedFavorites);
  };

  // Filter and auto-expand groups based on search query
  const { filteredNodes, autoExpandedGroups } = useMemo(() => {
    if (query.trim()) {
      return filterAndExpandNodes(portletData, query);
    }
    return { filteredNodes: portletData, autoExpandedGroups: {} };
  }, [portletData, query]);

  // Sort filtered portlets by current sort order
  const sorted = useMemo(
    () => sortPortlets(filteredNodes, sortOrder),
    [filteredNodes, sortOrder]
  );

  // Extract favorite portlet nodes from favorites map
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
        onRefresh={refresh}
        loading={loading}
      />

      <SidebarFavoritesSection
        favorites={favoriteItems}
        query={query}
        onToggleFavorite={handleToggleFavorite}
        onItemClick={onItemClick}
        highlight={(name) => name}
        showFavLimitPopup={showFavLimitPopup}
        setShowFavLimitPopup={setShowFavLimitPopup}
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
