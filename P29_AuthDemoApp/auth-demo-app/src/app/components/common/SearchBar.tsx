// src\app\components\common\SearchBar.tsx

"use client";

import { useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  /** Initial query value if using as uncontrolled component */
  defaultValue?: string;
  /** Controlled query value if managed externally */
  value?: string;
  /** Called when input changes (after debounce if set) */
  onChange?: (value: string) => void;
  /** Called when user presses Enter */
  onSubmit?: (value: string) => void;
  /** Debounce duration in ms */
  debounce?: number;
  /** Whether a search is loading */
  isLoading?: boolean;
  /** Aria label for screen readers */
  ariaLabel?: string;
}

export default function SearchBar({
  defaultValue = "",
  value,
  onChange,
  onSubmit,
  debounce = 300,
  isLoading = false,
  ariaLabel = "Search input",
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState(defaultValue);

  const isControlled = typeof value !== "undefined";
  const query = isControlled ? value : internalQuery;

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange?.(query);
    }, debounce);
    return () => clearTimeout(handler);
  }, [query, debounce, onChange]);

  const handleClear = () => {
    if (!isControlled) setInternalQuery("");
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit?.(query);
    }
  };

  return (
    <div className={styles.searchBar}>
      <Search className={styles.icon} aria-hidden="true" />
      <input
        type="text"
        className={styles.input}
        value={query}
        onChange={(e) =>
          isControlled
            ? onChange?.(e.target.value)
            : setInternalQuery(e.target.value)
        }
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        placeholder="Search..."
      />
      {query && !isLoading && (
        <X
          className={styles.clear}
          onClick={handleClear}
          role="button"
          aria-label="Clear search"
        />
      )}
      {isLoading && <Loader2 className={styles.loader} aria-hidden="true" />}
    </div>
  );
}
