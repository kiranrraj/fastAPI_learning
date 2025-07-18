// components/table/TopButton.tsx
import React from "react";
import styles from "./TopButton.module.css";
import { ArrowUp } from "lucide-react";

export default function TopButton() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <button className={styles.topBtn} onClick={scrollToTop}>
      <ArrowUp size={16} />
    </button>
  );
}
