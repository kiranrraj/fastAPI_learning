// src/app/components/layout/header/SettingsMenu.tsx

"use client";

import React from "react";
import DropdownMenu from "@/app/components/ui/DropdownMenu";
import IconSettings from "@/app/components/icons/IconSettings";
import styles from "./SettingsMenu.module.css";

/**
 * Component: SettingsModule
 * -------------------------
 * Settings icon that triggers a dropdown with actions like profile/settings/logout.
 */

const SettingsMenu: React.FC = () => {
  const handleProfile = () => {
    console.log("Profile clicked");
  };

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <DropdownMenu
      trigger={
        <button className={styles.settingsButton} title="Settings">
          <IconSettings size={22} />
        </button>
      }
    >
      <button onClick={handleProfile} className={styles.menuItem}>
        Profile
      </button>
      <button onClick={handleSettings} className={styles.menuItem}>
        Settings
      </button>
      <button onClick={handleLogout} className={styles.menuItem}>
        Logout
      </button>
    </DropdownMenu>
  );
};

export default SettingsMenu;
