"use client";

import React, { useState, useCallback, FormEvent } from "react";
import { useSession } from "next-auth/react";
import type { Subject } from "@/app/types/subjects";
import type { Portlet } from "@/app/types/portlet";

import styles from "./SimpleSubjectSearch.module.css";

interface SimpleSubjectSearchProps {
  portletData: Portlet;
}

export default function SimpleSubjectSearch({
  portletData,
}: SimpleSubjectSearchProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Subject[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    queryParams.append("limit", "50");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/subjects/search?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
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
      setError(`Failed to fetch subjects: ${err.message}`);
      setResults([]);
      setRawResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [session, API_BASE_URL, searchTerm]);

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
      <h2 className={styles.title}>
        {portletData.title || "Simple Subject Search"}
      </h2>
      <p className={styles.description}>
        {portletData.description ||
          "Search for clinical trial subjects by ID, MRN, or screening number."}
      </p>

      <form onSubmit={handleFormSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Enter Subject ID, MRN, or Screening Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          disabled={isLoading}
        />
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
          No subjects found matching your criteria.
        </div>
      ) : (
        <>
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
                  <th>Site Name</th>
                  <th>Protocol Name</th>
                  <th>Company Name</th>
                </tr>
              </thead>
              <tbody>
                {results.map((subject) => (
                  <tr key={subject.subjectId}>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.subjectId}
                      >
                        {subject.subjectId.substring(0, 8)}...
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.screeningNumber}
                      >
                        {subject.screeningNumber}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.medicalRecordNumber}
                      >
                        {subject.medicalRecordNumber}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={String(subject.age)}
                      >
                        {subject.age}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.gender}
                      >
                        {subject.gender}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.status}
                      >
                        {subject.status}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.siteName || ""}
                      >
                        {subject.siteName || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.protocolName || ""}
                      >
                        {subject.protocolName || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.cellContent}
                        title={subject.companyName || ""}
                      >
                        {subject.companyName || "N/A"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rawResponse && (
            <div className={styles.debugPanel}>
              <h3 className={styles.debugTitle}>Raw API Response</h3>
              <textarea
                className={styles.debugJson}
                value={JSON.stringify(rawResponse, null, 2)}
                readOnly
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
