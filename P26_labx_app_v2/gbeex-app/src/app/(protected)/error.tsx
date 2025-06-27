// /app/(protected)/error.tsx
"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ProtectedErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Oops! Something went wrong.</h1>
        <p className={styles.message}>
          We encountered an unexpected error while loading this page.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className={styles.stack}>{error?.message}</pre>
        )}

        <button onClick={() => reset()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    </div>
  );
}
