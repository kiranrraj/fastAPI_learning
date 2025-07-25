// app/components/common/PaginationControls.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Assuming lucide-react for arrow icons
import styles from "./PaginationControls.module.css"; // CSS Module for styling

interface PaginationControlsProps {
  currentPage: number; // The currently active page (1-indexed)
  totalCount: number; // The total number of items across all pages
  itemsPerPage: number; // Number of items displayed per page
  onPageChange: (page: number) => void; // Callback function when page changes
  isLoading?: boolean; // Optional loading state to disable controls
}

/**
 * PaginationControls component provides UI elements for navigating through paginated data.
 * It includes buttons for previous/next page and direct page number selection.
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}) => {
  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Determine which page numbers to display in the controls
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to display

    if (totalPages <= maxPagesToShow) {
      // If total pages are few, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a subset around the current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("..."); // Ellipsis
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("..."); // Ellipsis
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className={styles.paginationContainer}>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages} ({totalCount} items total)
      </span>
      <div className={styles.controls}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={styles.pageButton}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((num, index) => (
          <React.Fragment key={index}>
            {typeof num === "number" ? (
              <button
                onClick={() => onPageChange(num)}
                disabled={currentPage === num || isLoading}
                className={`${styles.pageButton} ${
                  currentPage === num ? styles.activePage : ""
                }`}
              >
                {num}
              </button>
            ) : (
              <span className={styles.ellipsis}>...</span>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={styles.pageButton}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
