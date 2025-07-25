// app/components/portlets/SubjectSearch.tsx
"use client"; // Marks this as a Client Component

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  useRef,
} from "react";
import { useSession } from "next-auth/react"; // Hook to access session data and access token
import type { Subject } from "@/app/types/subjects";
import type { Portlet } from "@/app/types/portlet"; // For portletData props from the Portlet system

import styles from "./SubjectSearch.module.css"; // CSS module for styling this component

// Define props for the SubjectSearch component
interface SubjectSearchProps {
  portletData: Portlet; // Contains the portlet's configuration (title, description, settings, etc.)
}

/**
 * SubjectSearch component provides a UI to search for clinical trial subjects.
 * It fetches data from the backend based on search terms and filters,
 * and displays the results in a table.
 */
export default function SubjectSearch({ portletData }: SubjectSearchProps) {
  // Access the user session to get the authentication token
  const { data: session } = useSession();

  // State for search form inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // State for search results, loading status, and errors
  const [results, setResults] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the base API URL from environment variables for backend communication
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Ref for debouncing API calls (to prevent excessive calls while typing)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetches subjects from the backend API based on current search and filter criteria.
   * This function is memoized using useCallback to optimize performance and prevent
   * unnecessary re-creations, especially important for debouncing.
   */
  const fetchSubjects = useCallback(async () => {
    // Ensure authentication token and API URL are available before proceeding
    if (!session?.accessToken || !API_BASE_URL) {
      setError("Authentication token missing or API URL not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Set loading state
    setError(null); // Clear previous errors

    // Construct query parameters from form state
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search_term", searchTerm);
    if (minAge) queryParams.append("min_age", minAge);
    if (maxAge) queryParams.append("max_age", maxAge);
    if (gender) queryParams.append("gender", gender);
    if (status) queryParams.append("status", status);

    try {
      // Make the API call to the subject search endpoint
      const response = await fetch(
        `${API_BASE_URL}/api/v1/subjects/search?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Attach auth token
          },
          // credentials: 'include' might be needed if cookies are used for auth,
          // but NextAuth JWTs are typically sent in the Authorization header.
        }
      );

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      // Parse and set the fetched data
      const data: Subject[] = await response.json();
      setResults(data);
    } catch (err: any) {
      // Catch and display any errors during the fetch operation
      setError(`Failed to fetch subjects: ${err.message}`);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false); // Clear loading state
    }
  }, [session, API_BASE_URL, searchTerm, minAge, maxAge, gender, status]); // Dependencies for useCallback

  /**
   * useEffect hook to trigger search whenever search/filter criteria change, with debouncing.
   * This prevents an API call on every keystroke.
   */
  useEffect(() => {
    // Clear any existing debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    // Set a new timeout to call fetchSubjects after a delay
    debounceTimeout.current = setTimeout(() => {
      fetchSubjects();
    }, 500); // 500ms debounce delay

    // Cleanup function: clear timeout if component unmounts or dependencies change
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [fetchSubjects]); // Dependency on fetchSubjects, which itself depends on search/filter states

  /**
   * Handles the form submission event (e.g., when user clicks the "Search" button).
   * Forces an immediate API call without waiting for the debounce timeout.
   * @param e The form submission event.
   */
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear debounce timeout for immediate search
    }
    fetchSubjects(); // Call fetchSubjects immediately
  };

  return (
    <div className={styles.container}>
      {/* Portlet Title and Description, using data from portletData props */}
      <h2 className={styles.title}>{portletData.title || "Subject Search"}</h2>
      <p className={styles.description}>
        {portletData.description ||
          "Search for clinical trial subjects across all companies and protocols."}
      </p>

      {/* Search Form */}
      <form onSubmit={handleFormSubmit} className={styles.searchForm}>
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="Search by ID, MRN, or Screening Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button
            type="submit"
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {/* Filter inputs */}
        <div className={styles.filters}>
          <input
            type="number"
            placeholder="Min Age"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            className={styles.filterInput}
          />
          <input
            type="number"
            placeholder="Max Age"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className={styles.filterInput}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Screening">Screening</option>
            <option value="Completed">Completed</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Pre-screening">Pre-screening</option>
            <option value="Screen Failure">Screen Failure</option>
            <option value="Lost to Follow-up">Lost to Follow-up</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </form>

      {/* Display error message if any */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Display summary of results found */}
      {results.length > 0 && (
        <div className={styles.resultsSummary}>
          Found {results.length} subject(s).
        </div>
      )}

      {/* Conditional rendering for loading, no results, or results table */}
      {isLoading ? (
        <div className={styles.loading}>Loading subjects...</div>
      ) : results.length === 0 &&
        !error &&
        !searchTerm &&
        !minAge &&
        !maxAge &&
        !gender &&
        !status ? (
        // Initial state or no search performed yet
        <div className={styles.noResults}>
          Use the search bar and filters above to find subjects.
        </div>
      ) : results.length === 0 && !error ? (
        // No results after a search
        <div className={styles.noResults}>
          No subjects found matching your criteria.
        </div>
      ) : (
        // Display results table
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Screening No.</th>
                <th>MRN</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Site</th>
                <th>Protocol</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {results.map((subject) => (
                <tr key={subject.subjectId}>
                  {/* Display only first 8 chars of Subject ID for brevity */}
                  <td>{subject.subjectId.substring(0, 8)}...</td>
                  <td>{subject.screeningNumber}</td>
                  <td>{subject.medicalRecordNumber}</td>
                  <td>{subject.age}</td>
                  <td>{subject.gender}</td>
                  <td>{subject.status}</td>
                  <td>{subject.siteName || "N/A"}</td>
                  <td>{subject.protocolName || "N/A"}</td>
                  <td>{subject.companyName || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
