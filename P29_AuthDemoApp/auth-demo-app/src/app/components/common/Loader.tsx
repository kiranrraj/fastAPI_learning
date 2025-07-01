// src\app\components\common\Loader.tsx

"use client";

import Spinner from "./Spinner";
import styles from "./Loader.module.css";

interface LoaderProps {
  message?: string;
  height?: string;
  showMessage?: boolean;
  className?: string;
}

export default function Loader({
  message = "Loading...",
  height = "50vh",
  showMessage = true,
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`${styles.loader} ${className}`}
      style={{ minHeight: height }}
      role="status"
      aria-busy="true"
    >
      <Spinner />
      {showMessage && <p className={styles.message}>{message}</p>}
    </div>
  );
}
