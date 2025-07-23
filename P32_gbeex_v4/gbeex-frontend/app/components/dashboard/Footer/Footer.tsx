// app/components/dashboard/Footer/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

export function Footer() {
  // !!!Important: Start with an empty string so SSR and client HTML match
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Update immediately on mount
    const update = () => setTime(new Date().toLocaleTimeString());
    update();

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className={styles.footer}>
      <span>Server status: OK</span>
      {/* !!!Important: Render the time only after hydration */}
      <span>{time}</span>
    </footer>
  );
}
