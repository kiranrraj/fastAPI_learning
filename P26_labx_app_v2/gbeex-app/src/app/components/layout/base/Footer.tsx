// src/app/components/layout/base/Footer.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";

/**
 * Component: Footer
 * -----------------
 * Displays the bottom section of the application.
 *
 * INPUT:
 * - None
 *
 * OUTPUT:
 * - Left: Application copyright
 * - Right: Current time (auto-updating) and server status
 */

const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update the current time every 60 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime(); // Initial set
    const timer = setInterval(updateTime, 60000); // Update every 60s

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Left side: copyright */}
      <div className={styles.left}>© 2025 GbeeX. All rights reserved.</div>

      {/* Right side: current time and server status */}
      <div className={styles.right}>
        <span className={styles.time}>{currentTime}</span>
        <span className={styles.status}>● Online</span>
      </div>
    </footer>
  );
};

export default Footer;
