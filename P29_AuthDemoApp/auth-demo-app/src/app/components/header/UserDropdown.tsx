// src\app\components\header\UserDropdown.tsx

"use client";

import { useState } from "react";
import { UserCircle, LogOut, Settings, Info, Shield } from "lucide-react";
import DropDown from "./DropDown";
import styles from "./UserDropdown.module.css";

interface UserDropdownProps {
  userName?: string;
  onLogout: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onAbout?: () => void;
  onAdminPanel?: () => void;
  isAdmin?: boolean;
}

export default function UserDropdown({
  userName = "User",
  onLogout,
  onProfile,
  onSettings,
  onAbout,
  onAdminPanel,
  isAdmin = false,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);

  const items = [
    {
      label: "Profile",
      icon: <UserCircle size={16} />,
      action: onProfile,
      tooltip: "Your profile details",
    },
    {
      label: "Settings",
      icon: <Settings size={16} />,
      action: onSettings,
      tooltip: "App preferences",
    },
    {
      label: "About",
      icon: <Info size={16} />,
      action: onAbout,
      tooltip: "Version and info",
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            icon: <Shield size={16} />,
            action: onAdminPanel,
            tooltip: "Administrative controls",
          },
        ]
      : []),
  ];

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setOpen(!open)}
        className={styles.dropdownButton}
        title="User Menu"
        aria-label="User Menu"
      >
        <UserCircle size={20} />
      </button>

      {open && (
        <DropDown
          label={userName}
          options={items.map((item) => item.label)}
          onSelect={(label) => {
            const found = items.find((item) => item.label === label);
            if (found && found.action) found.action();
            setOpen(false);
          }}
          icons={items.map((item) => item.icon)}
          tooltips={items.map((item) => item.tooltip)}
        />
      )}

      <button
        className={styles.logoutButton}
        onClick={onLogout}
        title="Logout"
        aria-label="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
