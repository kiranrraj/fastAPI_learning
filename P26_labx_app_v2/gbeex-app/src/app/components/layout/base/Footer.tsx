"use client";

import React from "react";
import styles from "./Footer.module.css";

interface FooterProps {
  lastRefreshTimestamp?: number; // Unix timestamp in ms for last data refresh
  serverStatus?: "online" | "offline" | "unknown"; // Server connection status
  currentTime?: string; // Current time string (HH:mm)
}

const Footer: React.FC<FooterProps> = ({
  lastRefreshTimestamp,
  serverStatus = "unknown",
  currentTime = "",
}) => {
  // Format last refresh time string
  const lastRefreshTime = lastRefreshTimestamp
    ? new Date(lastRefreshTimestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Status color based on server status
  const getStatusColor = () => {
    switch (serverStatus) {
      case "online":
        return "var(--status-online, #22c55e)";
      case "offline":
        return "var(--status-offline, #ef4444)";
      default:
        return "var(--status-unknown, #facc15)";
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>© 2025 GBeeX. All rights reserved.</div>

      <div className={styles.right}>
        <span className={styles.statusLabel}>Status:</span>
        <span
          className={styles.statusDot}
          style={{ color: getStatusColor() }}
          aria-label={`Server status: ${serverStatus}`}
          title={`Server status: ${serverStatus}`}
        >
          ●
        </span>
        <span className={styles.statusText}>{serverStatus}</span>

        {lastRefreshTime && (
          <>
            <span className={styles.separator}>|</span>
            <span className={styles.timeLabel}>Last Updated:</span>
            <span className={styles.timeText}>{lastRefreshTime}</span>
          </>
        )}

        {currentTime && (
          <>
            <span className={styles.separator}>|</span>
            <span className={styles.timeLabel}>Time:</span>
            <span className={styles.timeText}>{currentTime}</span>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
