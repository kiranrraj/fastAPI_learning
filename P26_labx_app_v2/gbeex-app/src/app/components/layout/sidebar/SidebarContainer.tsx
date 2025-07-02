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
import styles from "./SidebarContainer.module.css";

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
  const [loadingTimeoutExpired, setLoadingTimeoutExpired] = useState(false);

  const payload = { params: [{ include_children: true, limit: 10, skip: 0 }] };

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

  const portletData = useMemo(() => {
    if (!portletDataRaw) return [];
    return transformToPortletNodes(portletDataRaw);
  }, [portletDataRaw]);

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleExpandAll = () => setExpandAllCounter((c) => c + 1);
  const handleCollapseAll = () => setCollapseAllCounter((c) => c + 1);

  const handleToggleFavorite = (id: string) => {
    const { updatedFavorites, showLimitWarning } =
      handleFavoriteToggleWithLimit(favorites, id);
    if (showLimitWarning) {
      setShowFavLimitPopup(true);
    }
    setFavorites(updatedFavorites);
  };

  const { filteredNodes, autoExpandedGroups } = useMemo(() => {
    if (query.trim()) {
      return filterAndExpandNodes(portletData, query);
    }
    return { filteredNodes: portletData, autoExpandedGroups: {} };
  }, [portletData, query]);

  const sorted = useMemo(
    () => sortPortlets(filteredNodes, sortOrder),
    [filteredNodes, sortOrder]
  );

  const favoriteItems = useMemo(
    () => portletData.filter((node) => favorites[node.id]),
    [portletData, favorites]
  );

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeoutExpired(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeoutExpired(false);
    }
  }, [loading]);

  //Error fallback view
  if (
    (error || (!loading && portletData.length === 0)) &&
    loadingTimeoutExpired
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebarError}>
          <p>Failed to load sidebar content.</p>
          <button onClick={refresh} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
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
    </div>
  );
};

export default SidebarContainer;
