// src/app/components/SearchBar.tsx
"use client";

import React, { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search..." }: SearchBarProps) => {
  const [term, setTerm] = useState("");

  const handleSearch = () => {
    onSearch(term.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
        placeholder={placeholder}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
