import React from "react";
import styles from "@/app/components/ui/NotificationDropDown/NotificationItem.module.css";
import DismissIcon from "@/app/components/Icons/DismissIcon";
import type { Notification } from "@/app/types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string | number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
}) => {
  return (
    <div className={styles["notification-item"]}>
      <div className={styles["notification-item-content"]}>
        <p className={styles["notification-item-title"]}>
          {notification.title}
        </p>
        <p className={styles["notification-item-description"]}>
          {notification.description}
        </p>
      </div>
      <button
        className={styles["notification-item-dismiss"]}
        aria-label={`Dismiss notification: ${notification.title}`}
        onClick={() => onDismiss(notification.id)}
      >
        <DismissIcon size={12} strokeWidth={3} />
      </button>
    </div>
  );
};

export default NotificationItem;
