// src/app/components/layout/sidebar/SidebarContentArea.tsx

"use client";

import React, { useEffect, useState } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarGroupItem from "./SidebarGroupItem";
import SidebarChildItem from "./SidebarChildItem";
import { HighlightMatch } from "@/app/utils/sidebar/HighlightMatch";
import {
  expandAllGroups,
  collapseAllGroups,
} from "@/app/utils/sidebar/expandCollapseHandler";

export interface SidebarContentAreaProps {
  data: PortletNode[];
  query: string;
  autoExpandedGroups: Record<string, boolean>;
  expandAllTrigger: number;
  collapseAllTrigger: number;
  favorites?: Record<string, boolean>;
  onItemClick: (node: PortletNode) => void;
  onToggleFavorite?: (id: string) => void;
}

/**
 * SidebarContentArea
 * -------------------
 * Renders a group-child structure from flattened portlet data.
 * Handles:
 * - Auto-expand behavior during search
 * - Manual "Expand All" and "Collapse All"
 * - Favorites
 */
const SidebarContentArea: React.FC<SidebarContentAreaProps> = ({
  data,
  query,
  autoExpandedGroups,
  expandAllTrigger,
  collapseAllTrigger,
  favorites = {},
  onItemClick,
  onToggleFavorite = () => {},
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const isSearching = query.trim() !== "";

  /**
   * Auto-expand matching groups ONLY during search
   */
  useEffect(() => {
    if (!isSearching) return;
    if (!autoExpandedGroups || Object.keys(autoExpandedGroups).length === 0)
      return;

    setExpandedGroups((prev) => ({
      ...prev,
      ...autoExpandedGroups,
    }));
  }, [autoExpandedGroups, isSearching]);

  /**
   * "Expand All" button handler
   */
  useEffect(() => {
    const groupIds = data
      .filter((node) => node.type === "group")
      .map((g) => g.id);
    setExpandedGroups(expandAllGroups(groupIds));
  }, [expandAllTrigger, data]);

  /**
   * "Collapse All" button handler
   */
  useEffect(() => {
    const groupIds = data
      .filter((node) => node.type === "group")
      .map((g) => g.id);
    setExpandedGroups(collapseAllGroups(groupIds));
  }, [collapseAllTrigger, data]);

  /**
   * Toggle expand/collapse for a specific group
   */
  const handleToggleExpand = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <div className="space-y-2">
      {data.map((group) => {
        if (group.type !== "group") return null;

        const shouldExpand = isSearching
          ? !!autoExpandedGroups[group.id]
          : !!expandedGroups[group.id];

        const children = data.filter(
          (node) =>
            node.type === "item" &&
            (node.group_ids?.includes(group.id) ||
              node.parentIds?.includes(group.id))
        );

        return (
          <div key={group.id} className="space-y-1">
            <SidebarGroupItem
              group={group}
              isExpanded={shouldExpand}
              onToggleExpand={() => handleToggleExpand(group.id)}
              onGroupClick={() => onItemClick(group)}
              highlightedName={HighlightMatch(group.name, query)}
            />
            {shouldExpand &&
              children.map((child) => (
                <SidebarChildItem
                  key={child.id}
                  item={child}
                  onItemClick={() => onItemClick(child)}
                  isFavorite={favorites[child.id] ?? false}
                  onToggleFavorite={() => onToggleFavorite(child.id)}
                  highlightedName={HighlightMatch(child.name, query)}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarContentArea;
