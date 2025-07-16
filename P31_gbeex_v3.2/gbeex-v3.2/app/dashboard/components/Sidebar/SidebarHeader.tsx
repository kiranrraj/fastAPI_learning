"use client";

import React, { useContext, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Search,
  RefreshCw,
  ArrowDownAZ,
  ArrowUpZA,
} from "lucide-react";

import { SidebarContext } from "@/app/contexts/SidebarContext";
import { CompanyContext } from "@/app/contexts/CompanyContext";

import { getAllNodeIds } from "@/app/dashboard/utils/sidebar/getAllNodeIds";
import { expandAllNodes } from "@/app/dashboard/utils/sidebar/expandAllNodes";

import styles from "./SidebarHeader.module.css";

export default function SidebarHeader() {
  const {
    searchQuery,
    setSearchQuery,
    sortOrder,
    toggleSortOrder,
    collapseAll,
    resetSidebarState,
    setExpandedNodeIds,
  } = useContext(SidebarContext)!;

  const { companies } = useContext(CompanyContext)!;

  const [showClear, setShowClear] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowClear(e.target.value.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowClear(false);
  };

  const handleExpandAll = () => {
    const allNodeIds = getAllNodeIds(companies);
    const expandedSet = expandAllNodes(allNodeIds);
    setExpandedNodeIds(expandedSet);
  };

  return (
    <div className={styles.header}>
      <div className={styles.controls}>
        <button onClick={handleExpandAll} title="Expand All">
          <ChevronDown size={16} />
        </button>
        <button onClick={collapseAll} title="Collapse All">
          <ChevronUp size={16} />
        </button>
        <button
          className={`${styles.sortBtn} ${
            sortOrder === "asc" ? styles.asc : styles.desc
          }`}
          onClick={toggleSortOrder}
          title="Toggle Sort"
        >
          {sortOrder === "asc" ? (
            <ArrowDownAZ size={16} />
          ) : (
            <ArrowUpZA size={16} />
          )}
        </button>
        <button onClick={resetSidebarState} title="Reset All">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className={styles.searchContainer}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {showClear && (
          <button onClick={handleClearSearch} className={styles.clearBtn}>
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
