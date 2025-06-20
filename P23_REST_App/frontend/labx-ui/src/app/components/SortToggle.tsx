"use client";

import { useState } from "react";
import styles from "./SortToggle.module.css";

interface SortToggleProps {
  onToggle: (order: "asc" | "desc") => void;
  initialOrder?: "asc" | "desc";
  label?: string;
}

const SortToggle = ({
  onToggle,
  initialOrder = "asc",
  label,
}: SortToggleProps) => {
  const [order, setOrder] = useState<"asc" | "desc">(initialOrder);

  const handleClick = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onToggle(newOrder);
  };

  return (
    <button
      className={styles.sortToggle}
      onClick={handleClick}
      title="Toggle sort order"
    >
      {label && <span className={styles.sortLabel}>{label}</span>}
      <span className={styles.sortIcon}>{order === "asc" ? "↑" : "↓"}</span>
    </button>
  );
};

export default SortToggle;
