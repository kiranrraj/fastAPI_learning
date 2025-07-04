// src/app/components/tab/TabItem.tsx

"use client";

import { Star, Lock, LockOpen, X } from "lucide-react";
import { TabItemProps } from "@/app/types/tab.types";
import styles from "./TabItem.module.css";

export default function TabItem({
  id,
  title,
  isActive = false,
  isFavorite = false,
  isLocked = false,
  onSelect,
  onClose,
  onToggleFavorite,
  onToggleLock,
}: TabItemProps) {
  return (
    <div
      className={`${styles.tabItem} ${isActive ? styles.active : ""}`}
      onClick={() => onSelect(id)}
    >
      <span className={styles.tabTitle}>{title}</span>

      <div className={styles.controls}>
        {onToggleFavorite && (
          <button
            className={styles.iconBtn}
            title={isFavorite ? "Unfavorite" : "Favorite"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
          >
            <Star
              size={16}
              fill={isFavorite ? "gold" : "none"}
              stroke={isFavorite ? "gold" : "currentColor"}
            />
          </button>
        )}

        {onToggleLock && (
          <button
            className={styles.iconBtn}
            title={isLocked ? "Unlock" : "Lock"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(id);
            }}
          >
            {isLocked ? <Lock size={16} /> : <LockOpen size={16} />}
          </button>
        )}

        {!isLocked && (
          <button
            className={styles.iconBtn}
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
