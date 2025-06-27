// src/app/components/layout/header/HeaderRightArea.tsx

import React from "react";
import styles from "./HeaderRight.module.css";
import UserContainer from "./UserContainer";
import NotificationModule from "./NotificationModule";
import SettingsMenu from "./SettingsMenu";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

/**
 * Component: HeaderRightArea
 * ---------------------------
 * Renders the right-hand area of the header including:
 * - Notifications
 * - Settings
 * - Theme Toggle
 * - User dropdown
 *
 * INPUT: none
 * OUTPUT: UI cluster of control modules
 */
const HeaderRight: React.FC = () => {
  return (
    <div className={styles.rightArea}>
      <UserContainer />
      <SettingsMenu />
      <NotificationModule />
      <ThemeToggle />
      <LogoutButton />
    </div>
  );
};

export default HeaderRight;
