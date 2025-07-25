// app/components/portlets/SearchResultsTable.tsx
import React from "react";
import styles from "./SimpleSearch.module.css"; // Import the renamed CSS module

// Mock Subject interface for Canvas environment
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

interface SearchResultsTableProps {
  results: Subject[];
}

const SearchResultsTable: React.FC<SearchResultsTableProps> = ({ results }) => {
  return (
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
                <div className={styles.cellContent} title={subject.subjectId}>
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
                <div className={styles.cellContent} title={String(subject.age)}>
                  {subject.age}
                </div>
              </td>
              <td>
                <div className={styles.cellContent} title={subject.gender}>
                  {subject.gender}
                </div>
              </td>
              <td>
                <div className={styles.cellContent} title={subject.status}>
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
  );
};

export default SearchResultsTable;
