"use client";

import React from "react";
import styles from "./SidebarSearch.module.css";
import { Search, X } from "lucide-react";

interface SidebarSearchProps {
  query: string;
  setQuery: (value: string) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ query, setQuery }) => {
  return (
    <div className={styles.searchWrapper}>
      <span className={styles.icon}>
        <Search size={16} strokeWidth={2} />
      </span>

      <input
        type="text"
        placeholder="Search portlets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />

      {query && (
        <button
          className={styles.resetButton}
          onClick={() => setQuery("")}
          aria-label="Clear search"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default SidebarSearch;
