// src\app\components\header\NotificationsDropdown.tsx

"use client";

import { useState } from "react";
import styles from "./NotificationDropdown.module.css";
import { Bell, CheckCheck, X } from "lucide-react";
import { Notification } from "@/app/types/notification.types";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className={styles.container}>
      <button
        onClick={toggleDropdown}
        className={styles.iconButton}
        aria-label="Toggle notifications"
      >
        <Bell />
        {notifications.some((n) => !n.read) && (
          <span className={styles.badge}>
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {notifications.length === 0 ? (
            <div className={styles.empty}>No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notification} ${
                  notification.read ? styles.read : ""
                }`}
              >
                <span className={styles.message}>{notification.message}</span>

                <div className={styles.actions}>
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className={styles.iconBtn}
                      title="Mark as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className={styles.iconBtn}
                    title="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
