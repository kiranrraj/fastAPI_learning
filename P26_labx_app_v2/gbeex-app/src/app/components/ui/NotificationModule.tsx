"use client";

import React, { useState, useEffect } from "react";
import styles from "./NotificationModule.module.css";
import IconBell from "@/app/components/icons/IconBell";

/**
 * Component: NotificationModule
 * ------------------------------
 * Displays a bell icon for notifications with an optional red dot indicator.
 * In production, this would hook into a real notification system or WebSocket.
 *
 * INPUT:
 * - None directly; this is a self-contained UI module.
 *
 * OUTPUT:
 * - Shows bell icon with dynamic fill state.
 * - Dot appears if there are unread notifications.
 */

const NotificationModule: React.FC = () => {
  const [hasNotifications, setHasNotifications] = useState(false);

  // Mock example: simulate new notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNotifications(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.notificationWrapper}>
      <button
        className={styles.notificationButton}
        title="Notifications"
        onClick={() => setHasNotifications(false)}
      >
        <IconBell filled={hasNotifications} size={22} />
        {hasNotifications && <span className={styles.dot} />}
      </button>
    </div>
  );
};

export default NotificationModule;
