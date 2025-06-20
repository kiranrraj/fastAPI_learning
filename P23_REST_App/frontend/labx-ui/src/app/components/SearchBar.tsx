"use client";

import React, { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search..." }: SearchBarProps) => {
  const [term, setTerm] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(term.trim());
  };

  const handleClear = () => {
    setTerm("");
    onSearch("");
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <input
          id="search-input"
          name="search"
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
          placeholder={placeholder}
          autoComplete="off"
        />

        {term && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            title="Clear search"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
