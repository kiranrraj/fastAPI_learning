// src/app/components/layout/header/NotificationButton.tsx
import React from "react";
import IconNotification from "@/app/components/icons/IconNotification";
import styles from "@/app/components/styles/header/NotificationButton.module.css";

interface NotificationButtonProps {
  onClick?: () => void;
  hasUnread?: boolean;
  className?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  onClick,
  hasUnread = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick || (() => console.log("Notifications clicked"))}
      className={`relative p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${styles.notificationButton} ${className}`}
      aria-label="Notifications"
      title="Notifications"
    >
      <IconNotification className="text-gray-800 dark:text-gray-200" />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
};

export default React.memo(NotificationButton);
