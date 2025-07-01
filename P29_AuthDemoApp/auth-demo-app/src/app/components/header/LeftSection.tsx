// src\app\components\header\LeftSection.tsx

"use client";

import Link from "next/link";
import styles from "./LeftSection.module.css";

interface LeftSectionProps {
  logoUrl?: string;
  appName?: string;
}

export default function LeftSection({
  logoUrl = "/logo.svg", // fallback to SVG if none provided
  appName = "GBEEX",
}: LeftSectionProps) {
  return (
    <div className={styles.leftSection}>
      <Link href="/gbeex/dashboard" className={styles.brand}>
        <img src={logoUrl} alt="App Logo" className={styles.logo} />
        <span className={styles.appName}>{appName}</span>
      </Link>
    </div>
  );
}
