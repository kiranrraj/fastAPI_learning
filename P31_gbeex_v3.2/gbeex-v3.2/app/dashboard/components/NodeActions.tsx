"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import styles from "./NodeActions.module.css";

type NodeActionsProps = {
  nodeId: string;
};

const NodeActions: React.FC<NodeActionsProps> = ({ nodeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const context = useContext(SidebarContext);
  if (!context) return null;

  const { favoriteIds, hiddenIds, toggleFavorite, toggleHidden } = context;

  const isFavorite = favoriteIds.has(nodeId);
  const isHidden = hiddenIds.has(nodeId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.iconButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            onClick={() => {
              toggleFavorite(nodeId);
              setIsOpen(false);
            }}
          >
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>
          <button
            onClick={() => {
              toggleHidden(nodeId);
              setIsOpen(false);
            }}
          >
            {isHidden ? "Unhide" : "Hide"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NodeActions;
