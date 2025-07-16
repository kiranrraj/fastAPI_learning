"use client";

import React, { useContext } from "react";
import { Bell, X, Trash2 } from "lucide-react";
import {
  NotificationContext,
  NotificationContextType,
} from "@/app/contexts/NotificationContext";
import styles from "./NotificationPanel.module.css";

export default function NotificationPanel() {
  const {
    notifications,
    handleDeleteNotification,
    handleClearAllNotifications,
  } = useContext(NotificationContext) as NotificationContextType;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAllNotifications}
            className={styles.clearButton}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>
      <div className={styles.panelContent}>
        {notifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {notifications.map((n) => (
              <li key={n.id} className={styles.notificationItem}>
                <div className={styles.iconWrapper}>
                  <Bell size={16} />
                </div>
                <p className={styles.message}>{n.message}</p>
                <button
                  onClick={() => handleDeleteNotification(n.id)}
                  className={styles.deleteButton}
                  aria-label="Delete notification"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>No new notifications</p>
        )}
      </div>
    </div>
  );
}
