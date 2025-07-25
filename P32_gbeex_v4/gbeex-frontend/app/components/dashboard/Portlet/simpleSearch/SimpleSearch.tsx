// app/components/portlets/SimpleSearch.tsx
"use client";

import React, { useState, useCallback, FormEvent } from "react";
import SearchForm from "./SearchForm";
import SearchResultsTable from "./SearchResultsTable";
import DebugPanel from "./DebugPanel";
import styles from "./SimpleSearch.module.css";
const useSession = () => ({
  data: { accessToken: "mock-token-123", user: { name: "Test User" } },
});

interface Subject {
  subjectId: string;
  screeningNumber: string;
  medicalRecordNumber: string;
  age: number;
  gender: string;
  status: string;
  siteName?: string;
  protocolName?: string;
  companyName?: string;
}

interface Portlet {
  title?: string;
  description?: string;
}

interface SearchOption {
  value: string;
  label: string;
  placeholder: string;
}

const SEARCH_OPTIONS: SearchOption[] = [
  {
    value: "subject",
    label: "Subject (ID, MRN, Screening No.)",
    placeholder: "Enter Subject ID, MRN, or Screening Number",
  },
  {
    value: "company",
    label: "Company Name",
    placeholder: "Enter Company Name",
  },
  {
    value: "protocol",
    label: "Protocol Name",
    placeholder: "Enter Protocol Name",
  },
  { value: "site", label: "Site Name", placeholder: "Enter Site Name" },
  {
    value: "generic",
    label: "Generic Search (All Fields)",
    placeholder: "Search across all fields",
  },
];

interface SimpleSearchProps {
  portletData?: Portlet;
}

export default function SimpleSearch({
  portletData = {
    title: "Simple Search",
    description:
      "Search for clinical trial subjects, companies, protocols, or sites.",
  },
}: SimpleSearchProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>("subject");
  const [limit, setLimit] = useState<string>("50");
  const [results, setResults] = useState<Subject[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const API_BASE_URL = "https://your-api-base-url.com";

  const getPlaceholderText = useCallback(() => {
    const selectedOption = SEARCH_OPTIONS.find(
      (opt) => opt.value === searchCategory
    );
    return selectedOption ? selectedOption.placeholder : "Enter Search Term";
  }, [searchCategory]);

  const fetchSubjects = useCallback(async () => {
    if (!session?.accessToken || !API_BASE_URL) {
      setError("Authentication token missing or API URL not configured.");
      setIsLoading(false);
      return;
    }
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      setResults([]);
      setRawResponse(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setRawResponse(null);

    const queryParams = new URLSearchParams();
    queryParams.append("search_term", searchTerm.trim());
    queryParams.append("limit", limit);
    queryParams.append("search_category", searchCategory);

    try {
      // Determine the endpoint based on searchCategory
      let endpoint = `${API_BASE_URL}/api/v1/subjects/search`;
      if (searchCategory === "company") {
        endpoint = `${API_BASE_URL}/api/v1/companies/search`;
      } else if (searchCategory === "protocol") {
        endpoint = `${API_BASE_URL}/api/v1/protocols/search`;
      } else if (searchCategory === "site") {
        endpoint = `${API_BASE_URL}/api/v1/sites/search`;
      } else if (searchCategory === "generic") {
        endpoint = `${API_BASE_URL}/api/v1/generic/search`;
      }

      const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const json = await response.json();
      console.log("API response:", json);

      if (!response.ok) {
        throw new Error(
          json.detail || `HTTP error! status: ${response.status}`
        );
      }
      setRawResponse(json);
      setResults(json.items || []);
    } catch (err: any) {
      setError(`Failed to fetch: ${err.message}`);
      setResults([]);
      setRawResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [session, API_BASE_URL, searchTerm, searchCategory, limit]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchSubjects();
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setRawResponse(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{portletData.title}</h2>
      <p className={styles.description}>{portletData.description}</p>

      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        limit={limit}
        setLimit={setLimit}
        isLoading={isLoading}
        getPlaceholderText={getPlaceholderText}
        handleFormSubmit={handleFormSubmit}
        handleClear={handleClear}
        searchOptions={SEARCH_OPTIONS}
      />

      {error && <div className={styles.error}>{error}</div>}
      {results.length > 0 && (
        <div className={styles.resultsSummary}>
          Found {results.length} subject(s).
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Loading subjects...</div>
      ) : results.length === 0 && !error && !searchTerm.trim() ? (
        <div className={styles.noResults}>
          Enter a term in the search bar above to find subjects.
        </div>
      ) : results.length === 0 && !error ? (
        <div className={styles.noResults}>
          No results found matching your criteria.
        </div>
      ) : (
        <>
          <SearchResultsTable results={results} />
          {/* Conditionally render DebugPanel */}
          {showDebugPanel && <DebugPanel rawResponse={rawResponse} />}
        </>
      )}

      {/* Debug Toggle Button */}
      <div className={styles.debugToggleContainer}>
        <button
          type="button"
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className={styles.debugToggleButton}
        >
          {showDebugPanel ? "Hide Raw API Response" : "Show Raw API Response"}
        </button>
      </div>
    </div>
  );
}
