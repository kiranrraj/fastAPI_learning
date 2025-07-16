"use client";

import React, { useContext } from "react";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import { SidebarView } from "@/app/types";
import styles from "./SidebarViewSwitcher.module.css";

const views: SidebarView[] = ["all", "favorites", "hidden"];

export default function SidebarViewSwitcher() {
  const { activeView, setActiveView } = useContext(SidebarContext)!;

  return (
    <div className={styles.switcher}>
      {views.map((view) => (
        <button
          key={view}
          className={`${styles.tab} ${
            activeView === view ? styles.active : ""
          }`}
          onClick={() => setActiveView(view)}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
}
