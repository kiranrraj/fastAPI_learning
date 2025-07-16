"use client";

import React, { useContext } from "react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import { XCircle } from "lucide-react";
import styles from "./ClearSearchButton.module.css";

export default function ClearSearchButton() {
  const context = useContext(SidebarContext);
  if (!context) return null;

  const { searchQuery, setSearchQuery } = context;

  if (!searchQuery) return null;

  return (
    <button onClick={() => setSearchQuery("")} className={styles.clearBtn}>
      <XCircle size={16} />
    </button>
  );
}
