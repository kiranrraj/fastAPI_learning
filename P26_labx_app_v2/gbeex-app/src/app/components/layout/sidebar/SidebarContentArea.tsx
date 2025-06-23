// src/app/components/layout/sidebar/SidebarContentArea.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import styles from "./SidebarContentArea.module.css";
import SidebarGroupItem from "./SidebarGroupItem";
import SidebarChildItem from "./SidebarChildItem";
import SidebarFavoritesSection from "./SidebarFavoriteSection";
import { PortletNode } from "@/app/types/common/portlet.types";
import { highlightMatch } from "@/app/utils/sidebar/highlightHandler";
import {
  filterPortletsByGroupMatchOnly,
  filterPortletsByChildMatchOnly,
} from "@/app/utils/sidebar/filterHandler";
import {
  handleFavoriteToggleWithLimit,
  MAX_FAVORITES,
} from "@/app/utils/sidebar/favoriteHandler";

interface SidebarContentAreaProps {
  data: PortletNode[];
  query: string;
  onItemClick: (node: PortletNode) => void;
  autoExpandedGroups: Record<string, boolean>;
  expandAllTrigger: number;
  collapseAllTrigger: number;
}

const SidebarContentArea: React.FC<SidebarContentAreaProps> = ({
  data,
  query,
  onItemClick,
  autoExpandedGroups,
  expandAllTrigger,
  collapseAllTrigger,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  // Sync auto-expanded groups from search
  useEffect(() => {
    if (query.trim()) {
      setExpandedGroups((prev) => ({
        ...prev,
        ...autoExpandedGroups,
      }));
    }
  }, [autoExpandedGroups, query]);

  // Expand all groups on trigger
  useEffect(() => {
    if (expandAllTrigger === 0) return;
    const groupIds = data.filter((d) => d.type === "group").map((g) => g.id);
    setExpandedGroups(Object.fromEntries(groupIds.map((id) => [id, true])));
  }, [expandAllTrigger, data]);

  // Collapse all groups on trigger
  useEffect(() => {
    if (collapseAllTrigger === 0) return;
    setExpandedGroups({});
  }, [collapseAllTrigger]);

  // Toggle group expand state
  const toggleExpand = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Toggle favorite with limit enforcement
  const toggleFavorite = (itemId: string) => {
    const { updatedFavorites, showLimitWarning } =
      handleFavoriteToggleWithLimit(favorites, itemId);

    if (showLimitWarning) {
      setShowLimitPopup(true);
      setTimeout(() => setShowLimitPopup(false), 2000);
      return;
    }

    setFavorites(updatedFavorites);
  };

  // Extract groups and items
  const allGroups = data.filter((d) => d.type === "group");
  const allItems = data.filter((d) => d.type === "item");

  // Build map of children by group
  const groupChildrenMap: Record<string, PortletNode[]> = {};
  allItems.forEach((item) => {
    item.parentIds.forEach((gid) => {
      if (!groupChildrenMap[gid]) groupChildrenMap[gid] = [];
      groupChildrenMap[gid].push(item);
    });
  });

  // Filter and limit favorite items
  const favoriteItems = allItems
    .filter((item) => favorites[item.id])
    .slice(0, MAX_FAVORITES);

  // Matched group IDs
  const filteredGroupIds = useMemo(() => {
    if (!query.trim()) return allGroups.map((g) => g.id);
    return filterPortletsByGroupMatchOnly(allGroups, query).map((g) => g.id);
  }, [allGroups, query]);

  // Matched item IDs
  const filteredItemIds = useMemo(() => {
    if (!query.trim()) return allItems.map((i) => i.id);
    return filterPortletsByChildMatchOnly(allItems, query).map((i) => i.id);
  }, [allItems, query]);

  return (
    <div className={styles.contentArea}>
      {/* Popup warning when max favorite limit is hit */}
      {showLimitPopup && (
        <div className={styles.limitPopup}>
          ⚠️ Maximum of {MAX_FAVORITES} favorites reached.
        </div>
      )}

      {/* Reusable Favorites Section */}
      <SidebarFavoritesSection
        favorites={favoriteItems}
        query={query}
        onToggleFavorite={toggleFavorite}
        onItemClick={onItemClick}
        highlight={(text) => highlightMatch(text, query)}
      />

      {/* Render Groups and Filtered Children */}
      {allGroups.map((group) => {
        const children = (groupChildrenMap[group.id] || []).filter(
          (child) => !favorites[child.id]
        );

        const hasMatchingGroup = filteredGroupIds.includes(group.id);
        const matchingChildren = children.filter((c) =>
          filteredItemIds.includes(c.id)
        );

        const shouldExpand = query.trim()
          ? hasMatchingGroup || matchingChildren.length > 0
          : expandedGroups[group.id];

        if (
          query.trim() &&
          !hasMatchingGroup &&
          matchingChildren.length === 0
        ) {
          return null;
        }

        return (
          <div key={group.id} className={styles.groupSection}>
            <SidebarGroupItem
              group={group}
              isExpanded={shouldExpand}
              onToggleExpand={() => toggleExpand(group.id)}
              onGroupClick={() => onItemClick(group)}
              highlightedName={highlightMatch(group.name, query)}
            />
            {shouldExpand &&
              matchingChildren.map((child) => (
                <SidebarChildItem
                  key={child.id}
                  item={child}
                  isFavorite={!!favorites[child.id]}
                  onToggleFavorite={() => toggleFavorite(child.id)}
                  onItemClick={() => onItemClick(child)}
                  highlightedName={highlightMatch(child.name, query)}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarContentArea;
