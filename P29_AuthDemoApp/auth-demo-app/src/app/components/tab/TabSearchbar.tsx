// src\app\components\tab\TabSearchbar.tsx

"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import styles from "./TabSearchbar.module.css";

interface TabSearchBarProps {
  onSearch: (query: string) => void;
}

export default function TabSearchbar({ onSearch }: TabSearchBarProps) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, 400);
    return () => clearTimeout(handler);
  }, [value]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className={styles.wrapper}>
      <Search size={18} className={styles.icon} />
      <input
        type="text"
        placeholder="Search tabs..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.input}
        aria-label="Search tabs"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
