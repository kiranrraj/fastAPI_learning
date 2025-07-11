import React from "react";
import Button from "../Buttons/Button";
import NotificationItem from "@/app/components/ui/NotificationDropDown/NotificationItem";
import styles from "@/app/components/ui/NotificationDropDown/NotificationDropDown.module.css";
import type { Notification } from "@/app/types/notification.types";

interface NotificationDropdownProps {
  notifications: Notification[];
  onDismiss: (id: string | number) => void;
  onClearAll: () => void;
  onReadMore: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onReadMore,
}) => {
  const hasNotifications = notifications.length > 0;

  return (
    <div className={styles["notification-dropdown"]}>
      <div className={styles["notification-dropdown-header"]}>
        <h3 className={styles["notification-dropdown-title"]}>Notifications</h3>
        {hasNotifications && (
          <button
            className={styles["notification-dropdown-clear-all"]}
            onClick={onClearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles["notification-dropdown-list"]}>
        {hasNotifications ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={onDismiss}
            />
          ))
        ) : (
          <p className={styles["notification-dropdown-empty"]}>
            You have no new notifications.
          </p>
        )}
      </div>

      {hasNotifications && (
        <div className={styles["notification-dropdown-footer"]}>
          <Button
            variant="ghost"
            onClick={onReadMore}
            className={styles["notification-read-more"]}
          >
            Read More
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
