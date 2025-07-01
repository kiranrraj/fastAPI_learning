// src\app\components\common\Spinner.tsx

"use client";

import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "danger";
  ariaLabel?: string;
}

export default function Spinner({
  size = "md",
  color = "primary",
  ariaLabel = "Loading",
}: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size || "md"]} ${
        styles[color || "primary"]
      }`}
      role="status"
      aria-label={ariaLabel}
    />
  );
}
