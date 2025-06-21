"use client";

import React from "react";
import { SidebarGroup, Investigation } from "@/app/types/sidebar.types";
import IconStar from "@/app/components/icons/IconStar";
import IconStarFilled from "@/app/components/icons/IconStarFilled";
import IconChevronDown from "@/app/components/icons/IconChevronDown";
import IconChevronUp from "@/app/components/icons/IconChevronUp";
import { toggleSetValue } from "@/app/components/utils/sidebar/handler_toggle";

interface SidebarListProps {
  groups: SidebarGroup[];
  favorites: Investigation[];
  toggleFavorite: (item: Investigation, fromGroupId?: string) => void;
  expandedGroups: Set<string>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const SidebarList: React.FC<SidebarListProps> = ({
  groups,
  favorites,
  toggleFavorite,
  expandedGroups,
  setExpandedGroups,
}) => {
  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => toggleSetValue(prev, id));
  };

  const isFavorite = (item: Investigation) =>
    favorites.some((f) => f.id === item.id);

  return (
    <div className="space-y-4">
      {favorites.length > 0 && (
        <div>
          <div className="font-semibold text-yellow-600">Favorites</div>
          <ul className="ml-4">
            {favorites.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between">
                <span>{inv.name}</span>
                <button
                  onClick={() => toggleFavorite(inv)}
                  title="Remove from favorites"
                >
                  <IconStarFilled />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.id);
        return (
          <div key={group.id}>
            <div className="font-semibold flex items-center">
              <button
                className="mr-2"
                onClick={() => toggleGroup(group.id)}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
              </button>
              <span>{group.name}</span>
            </div>

            {isExpanded && group.investigations.length > 0 && (
              <ul className="ml-4">
                {group.investigations.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between"
                  >
                    <span>{inv.name}</span>
                    <button onClick={() => toggleFavorite(inv, group.id)}>
                      {isFavorite(inv) ? <IconStarFilled /> : <IconStar />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SidebarList);
