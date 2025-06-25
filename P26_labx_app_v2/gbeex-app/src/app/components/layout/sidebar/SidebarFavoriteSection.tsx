"use client";

import React, { useState, useEffect } from "react";
import styles from "./SidebarFavoriteSection.module.css";
import { PortletNode } from "@/app/types/common/portlet.types";
import SidebarChildItem from "./SidebarChildItem";
import IconChevronDown from "../../icons/IconChevronDown";
import IconChevronUp from "../../icons/IconChevronUp";
import AlertPopup from "@/app/components/common/AlertPopup";

interface SidebarFavoritesSectionProps {
  favorites: PortletNode[];
  query: string;
  onToggleFavorite: (id: string) => void;
  onItemClick: (node: PortletNode) => void;
  highlight: (name: string) => React.ReactNode;
  showFavLimitPopup: boolean;
  setShowFavLimitPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_FAVORITES = 5;

const SidebarFavoritesSection: React.FC<SidebarFavoritesSectionProps> = ({
  favorites,
  query,
  onToggleFavorite,
  onItemClick,
  highlight,
  showFavLimitPopup,
  setShowFavLimitPopup,
}) => {
  const [expanded, setExpanded] = useState(true);

  // Auto-hide popup after duration
  useEffect(() => {
    if (showFavLimitPopup) {
      const timer = setTimeout(() => setShowFavLimitPopup(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showFavLimitPopup, setShowFavLimitPopup]);

  if (favorites.length === 0) return null;

  const handleToggleFavoriteLocal = (id: string) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === id);
    if (!isAlreadyFavorite && favorites.length >= MAX_FAVORITES) {
      setShowFavLimitPopup(true);
      return;
    }
    onToggleFavorite(id);
  };

  return (
    <>
      <div className={styles.favoritesWrapper}>
        <div
          className={styles.header}
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setExpanded(!expanded);
            }
          }}
        >
          <span className={styles.toggle}>
            {expanded ? <IconChevronDown /> : <IconChevronUp />}
          </span>
          <span className={styles.title}>Favorites</span>
        </div>
        {expanded && (
          <ul className={styles.list}>
            {favorites.map((fav) => (
              <li key={fav.id} className={styles.item}>
                <SidebarChildItem
                  item={fav}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavoriteLocal(fav.id)}
                  onItemClick={() => onItemClick(fav)}
                  highlightedName={highlight(fav.name)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {showFavLimitPopup && (
        <AlertPopup
          message={`Maximum ${MAX_FAVORITES} favorites allowed.`}
          type="warning"
          onClose={() => setShowFavLimitPopup(false)}
          duration={4000}
          showCloseButton={true}
          position="top-right"
        />
      )}
    </>
  );
};

export default SidebarFavoritesSection;
