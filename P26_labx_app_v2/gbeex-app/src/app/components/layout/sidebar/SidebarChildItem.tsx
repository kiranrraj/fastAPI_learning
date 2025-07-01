// src/app/components/sidebar/SidebarChildItem.tsx

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./SidebarChildItem.module.css";
import { Star, StarOff } from "lucide-react";

export interface SidebarChildItemProps {
  item: PortletNode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onItemClick: () => void;
  highlightedName: React.ReactNode;
}

const SidebarChildItem: React.FC<SidebarChildItemProps> = ({
  isFavorite,
  onToggleFavorite,
  onItemClick,
  highlightedName,
}) => {
  return (
    <div className={styles.childItemWrapper}>
      <button
        className={styles.starButton}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        {isFavorite ? <StarOff size={14} /> : <Star size={14} />}
      </button>
      <span className={styles.itemName} onClick={onItemClick}>
        {highlightedName}
      </span>
    </div>
  );
};

export default SidebarChildItem;
