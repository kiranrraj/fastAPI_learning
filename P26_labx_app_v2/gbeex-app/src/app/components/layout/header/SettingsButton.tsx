// src/app/components/layout/header/SettingsButton.tsx
import React from "react";
import DropdownMenu from "@/app/components/ui/DropdownMenu";
import IconSettings from "@/app/components/icons/IconSettings";
import styles from "@/app/components/styles/header/SettingsButton.module.css";

const SettingsButton = React.memo(() => {
  const menuItems = [
    {
      label: "Profile",
      onClick: () => console.log("Go to profile settings"),
    },
    {
      label: "Preferences",
      onClick: () => console.log("Open preferences"),
    },
    {
      label: "Language",
      onClick: () => console.log("Language selector"),
    },
  ];

  return (
    <DropdownMenu
      button={
        <div
          className={`p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${styles.settingsButton}`}
          aria-label="Settings"
          data-testid="settings-button"
        >
          <IconSettings className="text-gray-800 dark:text-gray-200" />
        </div>
      }
      items={menuItems}
      position="right"
    />
  );
});

SettingsButton.displayName = "SettingsButton";
export default SettingsButton;
