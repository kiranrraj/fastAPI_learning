"use client"; // Error components must be Client Components

import { useEffect } from "react";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* Error Icon */}
        <div className={styles.iconWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.description}>
          An unexpected error occurred. Please try again.
        </p>

        {/* Reset Button */}
        <button
          onClick={
            // Attempt to recover by re-rendering the segment
            () => reset()
          }
          className={styles.button}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
