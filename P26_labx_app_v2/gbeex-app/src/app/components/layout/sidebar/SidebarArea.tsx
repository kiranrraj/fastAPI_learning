"use client";

import React from "react";
import SidebarDataLoader from "./SidebarDataLoader";
import SidebarControlGroup from "./SidebarControlGroup";
import styles from "@/app/components/styles/sidebar/SidebarArea.module.css";
import { InvestigationGroup } from "@/app/types/sidebar.types";

interface SidebarAreaProps {
  className?: string;
  onGroupClick: (group: InvestigationGroup) => void;
  onItemClick: (item: any) => void;
}

const SidebarArea: React.FC<SidebarAreaProps> = ({
  className = "",
  onGroupClick,
  onItemClick,
}) => {
  return (
    <aside
      className={`w-64 min-w-[16rem] max-w-[20rem] border-r bg-white dark:bg-gray-800 p-4 overflow-y-auto ${styles.sidebarArea} ${className}`}
      aria-label="Sidebar"
    >
      {/* Controls (e.g., search, filters, etc.) */}
      <SidebarControlGroup />

      {/* Loads and renders investigation groups and children */}
      <SidebarDataLoader
        onGroupClick={onGroupClick}
        onItemClick={onItemClick}
      />
    </aside>
  );
};

export default React.memo(SidebarArea);
