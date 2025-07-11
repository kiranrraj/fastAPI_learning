"use client";

import React, { useEffect } from "react";
import { ServerCrash, RefreshCw } from "lucide-react";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ServerCrash className={styles.icon} />
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.subtitle}>
          We're sorry, but we encountered an unexpected issue. Our team has been
          notified.
        </p>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className={`btn btn-primary ${styles.button}`}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
}
