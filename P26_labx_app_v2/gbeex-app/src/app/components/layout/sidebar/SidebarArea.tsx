// src/app/components/layout/sidebar/SidebarArea.tsx

import React from "react";
import SidebarControlGroup from "./SidebarControlGroup";
import SidebarDataGroup from "./SidebarDataGroup";
import styles from "@/app/components/styles/sidebar/SidebarArea.module.css";

const SidebarArea: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <aside
      className={`w-64 min-w-[16rem] max-w-[20rem] border-r bg-white dark:bg-gray-800 p-4 overflow-y-auto ${styles.sidebarArea} ${className}`}
      aria-label="Sidebar"
    >
      <SidebarControlGroup />
      <SidebarDataGroup />
    </aside>
  );
};

export default React.memo(SidebarArea);
