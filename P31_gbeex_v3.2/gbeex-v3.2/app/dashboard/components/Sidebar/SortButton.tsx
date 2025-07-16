"use client";

import React, { useContext } from "react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import { ArrowUpZA, ArrowDownZA } from "lucide-react";
import styles from "./SortButton.module.css";

export default function SortButton() {
  const { sortOrder, toggleSortOrder } = useContext(SidebarContext)!;

  return (
    <button onClick={toggleSortOrder} className={styles.sortBtn}>
      {sortOrder === "asc" ? (
        <ArrowUpZA size={16} className={styles.iconAnim} />
      ) : (
        <ArrowDownZA size={16} className={styles.iconAnim} />
      )}
    </button>
  );
}
