import React from "react";
import styles from "./ErrorView.module.css";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.errorWrapper} role="alert" aria-live="assertive">
      <div className={styles.icon} aria-hidden="true">
        ⚠️
      </div>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
          aria-label="Retry loading"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorView;
