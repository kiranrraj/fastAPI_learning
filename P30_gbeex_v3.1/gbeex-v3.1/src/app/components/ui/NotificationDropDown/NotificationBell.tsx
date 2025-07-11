// --- Icon Components (usage replacement for Header.tsx) ---
import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/ui/Buttons/Button";
import DropdownPanel from "@/app/components/ui/DropDownPanel/DropDownPanel";
import NotificationDropdown from "@/app/components/ui/NotificationDropDown/NotificationDropDown";
import BellIcon from "@/app/components/Icons/BellIcon";
import styles from "@/app/components/ui/NotificationDropDown/NotificationBell.module.css";
import type { Notification } from "@/app/types/notification.types";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Ravi commented on your design",
    description: '"Looks awesome, Kiran bhai! Well done."',
  },
  {
    id: 2,
    title: "Deployment to Vercel completed",
    description: "Your app 'Kiran-Portal' was deployed successfully.",
  },
  {
    id: 3,
    title: "@shruti mentioned you",
    description: '"Kiran, please review the latest task in Jira."',
  },
  {
    id: 4,
    title: "Payment Received",
    description: "₹4,500 received from Rajesh for Invoice #INV-0725.",
  },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasUnread = notifications.length > 0;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleDismiss = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const handleReadMore = () => {
    console.log("Read More clicked!");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles["notification-bell-container"]} ref={dropdownRef}>
      <Button
        variant="icon"
        aria-label="View notifications"
        onClick={toggleDropdown}
        className={styles["notification-bell-trigger"]}
      >
        <BellIcon />
        {hasUnread && <span className={styles["notification-bell-badge"]} />}
      </Button>

      <DropdownPanel isOpen={isOpen}>
        <NotificationDropdown
          notifications={notifications}
          onDismiss={handleDismiss}
          onClearAll={handleClearAll}
          onReadMore={handleReadMore}
        />
      </DropdownPanel>
    </div>
  );
};

export default NotificationBell;
