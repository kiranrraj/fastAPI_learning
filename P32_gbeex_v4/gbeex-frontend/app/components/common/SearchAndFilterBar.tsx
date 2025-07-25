// app/components/common/SearchAndFilterBar.tsx
"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import styles from "./SearchAndFilterBar.module.css";

interface SearchAndFilterBarProps {
  onSearch: (
    searchTerm: string,
    filters: Record<string, string | number | undefined>
  ) => void;
  currentLevel: string;
  loading: boolean;
  initialSearchTerm?: string;
  initialFilters?: Record<string, string | number | undefined>;
  filterOptions?: {
    minAge?: boolean;
    maxAge?: boolean;
    gender?: boolean;
    status?: string[];
  };
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  onSearch,
  currentLevel,
  loading,
  initialSearchTerm = "",
  initialFilters = {},
  filterOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [minAge, setMinAge] = useState<string>(
    String(initialFilters.minAge || "")
  );
  const [maxAge, setMaxAge] = useState<string>(
    String(initialFilters.maxAge || "")
  );
  const [gender, setGender] = useState<string>(
    String(initialFilters.gender || "")
  );
  const [status, setStatus] = useState<string>(
    String(initialFilters.status || "")
  );

  // Removed: The debounceTimeoutRef is no longer needed if search is only on button press
  // Removed: useEffect that triggered debounced search

  // Handler to consolidate filter values and call onSearch prop
  const handleSearchTrigger = () => {
    const filters = {
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      gender: gender || undefined,
      status: status || undefined,
    };
    onSearch(searchTerm, filters);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Removed: clearTimeout(debounceTimeoutRef.current) as debounce is removed
    handleSearchTrigger(); // Always trigger immediate search on explicit submit
  };

  const getPlaceholder = () => {
    switch (currentLevel) {
      case "companies":
        return "Search company name...";
      case "protocols":
        return "Search protocol name, drug...";
      case "sites":
        return "Search site name, city, country...";
      case "subjects":
        return "Search subject ID, MRN, screening no...";
      default:
        return "Search...";
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {filterOptions &&
        (filterOptions.minAge ||
          filterOptions.maxAge ||
          filterOptions.gender ||
          filterOptions.status) && (
          <div className={styles.filtersContainer}>
            {filterOptions.minAge && (
              <input
                type="number"
                className={styles.filterInput}
                placeholder="Min Age"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                disabled={loading}
              />
            )}
            {filterOptions.maxAge && (
              <input
                type="number"
                className={styles.filterInput}
                placeholder="Max Age"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                disabled={loading}
              />
            )}
            {filterOptions.gender && (
              <select
                className={styles.filterSelect}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}
            {filterOptions.status && filterOptions.status.length > 0 && (
              <select
                className={styles.filterSelect}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
              >
                <option value="">All Statuses</option>
                {filterOptions.status.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchAndFilterBar;
