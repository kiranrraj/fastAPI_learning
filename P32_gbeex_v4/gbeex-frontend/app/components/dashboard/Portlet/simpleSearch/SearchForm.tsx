// app/components/portlets/SearchForm.tsx
import React, { FormEvent } from "react";
import styles from "./SimpleSearch.module.css"; // Import the renamed CSS module

// Define SearchOption interface here as it's used by this component
interface SearchOption {
  value: string;
  label: string;
  placeholder: string;
}

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchCategory: string;
  setSearchCategory: (category: string) => void;
  limit: string;
  setLimit: (limit: string) => void;
  isLoading: boolean;
  getPlaceholderText: () => string;
  handleFormSubmit: (e: FormEvent) => void;
  handleClear: () => void;
  searchOptions: SearchOption[]; // Prop for search options
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchCategory,
  setSearchCategory,
  limit,
  setLimit,
  isLoading,
  getPlaceholderText,
  handleFormSubmit,
  handleClear,
  searchOptions,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className={styles.searchForm}>
      <div className={styles.radioGroup}>
        {searchOptions.map((option) => (
          <div key={option.value} className={styles.radioOption}>
            <input
              type="radio"
              id={`search-${option.value}`}
              name="searchCategory"
              value={option.value}
              checked={searchCategory === option.value}
              onChange={(e) => setSearchCategory(e.target.value)}
              disabled={isLoading}
            />
            <label htmlFor={`search-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder={getPlaceholderText()}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
        disabled={isLoading}
      />

      <select
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        className={styles.searchLimitSelect}
        disabled={isLoading}
      >
        <option value="10">Limit: 10</option>
        <option value="25">Limit: 25</option>
        <option value="50">Limit: 50</option>
        <option value="100">Limit: 100</option>
      </select>

      <button
        type="submit"
        className={styles.searchButton}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
      <button
        type="button"
        onClick={handleClear}
        className={styles.clearButton}
        disabled={isLoading}
      >
        Clear
      </button>
    </form>
  );
};

export default SearchForm;
