// src/app/components/sidebar/SidebarFavoritesSection.tsx

"use client";

import React, { useState } from "react";
import styles from "./SidebarFavoriteSection.module.css";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarChildItem from "./SidebarChildItem";

interface SidebarFavoritesSectionProps {
  favorites: PortletNode[];
  query: string;
  onToggleFavorite: (id: string) => void;
  onItemClick: (node: PortletNode) => void;
  highlight: (name: string) => React.ReactNode;
}

/**
 * SidebarFavoritesSection
 * -----------------------
 * Displays a collapsible section with actual favorite items.
 */
const SidebarFavoritesSection: React.FC<SidebarFavoritesSectionProps> = ({
  favorites,
  query,
  onToggleFavorite,
  onItemClick,
  highlight,
}) => {
  const [expanded, setExpanded] = useState(true);

  if (favorites.length === 0) return null;

  return (
    <div className={styles.favoritesWrapper}>
      <div className={styles.header} onClick={() => setExpanded(!expanded)}>
        <span className={styles.title}>★ Favorites</span>
        <span className={styles.toggle}>{expanded ? "▾" : "▸"}</span>
      </div>
      {expanded && (
        <ul className={styles.list}>
          {favorites.map((fav) => (
            <li key={fav.id} className={styles.item}>
              <SidebarChildItem
                item={fav}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(fav.id)}
                onItemClick={() => onItemClick(fav)}
                highlightedName={highlight(fav.name)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarFavoritesSection;
