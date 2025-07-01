// src/app/components/layout/base/Footer.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";

interface FooterProps {
  lastRefreshTimestamp?: number; // Unix timestamp in ms for last data refresh
  serverStatus?: "online" | "offline" | "unknown"; // Server connection status
}

const Footer: React.FC<FooterProps> = ({
  lastRefreshTimestamp,
  serverStatus = "unknown",
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("");

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

  // Update last refresh time display when timestamp changes
  useEffect(() => {
    if (lastRefreshTimestamp) {
      const d = new Date(lastRefreshTimestamp);
      setLastRefreshTime(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      setLastRefreshTime("");
    }
  }, [lastRefreshTimestamp]);

  // Get status indicator color
  const getStatusColor = () => {
    switch (serverStatus) {
      case "online":
        return "var(--status-online, #22c55e)"; // green
      case "offline":
        return "var(--status-offline, #ef4444)"; // red
      default:
        return "var(--status-unknown, #facc15)"; // yellow
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Left side: copyright */}
      <div className={styles.left}>© 2025 GBeeX. All rights reserved.</div>

      {/* Right side: current time, last refresh, and server status */}
      <div className={styles.right}>
        <span className={styles.time}>Time: {currentTime}</span>
        {lastRefreshTime && (
          <span className={styles.lastRefresh}>
            Last refreshed: {lastRefreshTime}
          </span>
        )}
        <span
          className={styles.status}
          style={{ color: getStatusColor() }}
          aria-label={`Server status: ${serverStatus}`}
          title={`Server status: ${serverStatus}`}
        >
          ●
        </span>
      </div>
    </footer>
  );
};

export default Footer;
