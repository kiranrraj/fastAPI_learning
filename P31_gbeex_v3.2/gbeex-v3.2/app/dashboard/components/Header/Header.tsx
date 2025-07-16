"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import { Menu, Bell, PanelRightOpen, PanelRightClose, X } from "lucide-react";

// Import all the child components and contexts we created
import UserMenu from "@/app/dashboard/components/UserMenu/UserMenu";
import SettingsMenu from "@/app/dashboard/components/SettingsMenu/SettingsMenu";
import HelpMenu from "@/app/dashboard/components/HelpMenu/HelpMenu";
import NotificationPanel from "@/app/dashboard/components/NotificationPanel/NotificationPanel";
import {
  NotificationContext,
  NotificationContextType,
} from "@/app/contexts/NotificationContext";

import styles from "./Header.module.css";

// The Header now accepts props from the main layout for toggling UI elements
interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleHeader: () => void; // Assuming this collapses the header itself
}

export default function Header({
  onToggleSidebar,
  onToggleHeader,
}: HeaderProps) {
  // Get notifications from its context to display the badge count
  const { notifications } = useContext(
    NotificationContext
  ) as NotificationContextType;

  // State for the main hamburger menu icon
  const [isMenuOpen, setMenuOpen] = useState(false);
  // State for the header collapse icon
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false);

  // The Header still manages the visibility of the notification panel, as it's not a simple dropdown
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Effect to close the notification panel when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationPanelOpen(false);
      }
    };
    if (isNotificationPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationPanelOpen]);

  const handleSidebarToggle = () => {
    setMenuOpen(!isMenuOpen);
    onToggleSidebar();
  };

  const handleHeaderToggle = () => {
    setHeaderCollapsed(!isHeaderCollapsed);
    onToggleHeader();
  };

  return (
    <header
      className={`${styles.header} ${
        isHeaderCollapsed ? styles.collapsedHeader : ""
      }`}
    >
      {/* Left Side: Sidebar Toggle */}
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={handleSidebarToggle}
          aria-label="Toggle sidebar"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* App Name in the Center */}
      <div className={styles.appName}>
        <span className={styles.appNameG}>G</span>
        <span className={styles.appNameBee}>Bee</span>
        <span className={styles.appNameX}>X</span>
        <span className={styles.appNameSub}>&nbsp;Knowledge Portal</span>
      </div>

      {/* Right Side: Icons and Menus */}
      <div className={styles.right}>
        <button onClick={handleHeaderToggle} className={styles.iconBtn}>
          {isHeaderCollapsed ? (
            <PanelRightClose size={20} />
          ) : (
            <PanelRightOpen size={20} />
          )}
        </button>

        {/* All dropdowns are now self-contained components */}
        <UserMenu />

        <div className={styles.notificationWrapper} ref={notificationRef}>
          <button
            onClick={() => setIsNotificationPanelOpen((prev) => !prev)}
            className={styles.iconBtn}
            aria-label={`Notifications (${notifications.length})`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles.notificationBadge}>
                {notifications.length}
              </span>
            )}
          </button>
          {isNotificationPanelOpen && <NotificationPanel />}
        </div>

        <HelpMenu />
        <SettingsMenu />

        {/* The Logout button is now part of the UserMenu, but if you want it separate, it can stay here */}
        {/* For this refactor, we assume it's inside UserMenu for a cleaner look */}
      </div>
    </header>
  );
}
