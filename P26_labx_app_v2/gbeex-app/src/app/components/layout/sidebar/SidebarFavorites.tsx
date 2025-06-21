// src/app/components/layout/sidebar/SidebarFavorites.tsx

"use client";
import React, { useState } from "react";
import IconChevronDown from "@/app/components/icons/IconChevronDown";
import IconChevronUp from "@/app/components/icons/IconChevronUp";
import IconClose from "@/app/components/icons/IconClose";

interface InvestigationItem {
  id: string;
  name: string;
}

interface SidebarFavoritesProps {
  favorites: InvestigationItem[];
  onRemove: (id: string) => void;
}

const SidebarFavorites: React.FC<SidebarFavoritesProps> = ({
  favorites,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="sidebarFavorites px-2 py-1">
      <div
        className="sidebarFavoritesHeader flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="sidebarFavoritesTitle text-sm font-semibold">
          Favorites
        </h3>
        <span className="sidebarFavoritesToggle">
          {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
        </span>
      </div>

      {isExpanded && (
        <ul className="sidebarFavoritesList mt-1 space-y-1">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="sidebarFavoritesItem flex items-center justify-between text-sm pl-2 pr-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <span>{fav.name}</span>
              <button
                onClick={() => onRemove(fav.id)}
                className="sidebarFavoritesRemove p-0.5 hover:text-red-500"
                aria-label={`Remove ${fav.name}`}
              >
                <IconClose className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(SidebarFavorites);
