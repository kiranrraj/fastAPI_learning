// src/app/components/sidebar/SidebarSearch.tsx

"use client";

import React from "react";
import styles from "./SidebarSearch.module.css";
import IconCloseButton from "../../icons/IconCloseButton";
import IconSearch from "../../icons/IconSearch";

interface SidebarSearchProps {
  query: string;
  setQuery: (value: string) => void;
}

/**
 * SidebarSearch
 * -------------
 * Controlled search input with icon and reset.
 * Props:
 * - query: string - current search value
 * - setQuery: function - updates query in parent
 */
const SidebarSearch: React.FC<SidebarSearchProps> = ({ query, setQuery }) => {
  return (
    <div className={styles.searchWrapper}>
      <span className={styles.icon}>
        <IconSearch />
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
          <IconCloseButton />
        </button>
      )}
    </div>
  );
};

export default SidebarSearch;
