// src/app/components/header/UserDropdown.tsx

"use client";

import { useState } from "react";
import { UserCircle, LogOut, Settings, Info, Shield } from "lucide-react";
import DropDown, { DropDownAction } from "@/app/components/common/DropDown";
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

  const items: DropDownAction[] = [
    {
      label: "Profile",
      icon: UserCircle,
      onClick: onProfile ?? (() => {}),
      tooltip: "Your profile details",
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: onSettings ?? (() => {}),
      tooltip: "App preferences",
    },
    {
      label: "About",
      icon: Info,
      onClick: onAbout ?? (() => {}),
      tooltip: "Version and info",
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            icon: Shield,
            onClick: onAdminPanel ?? (() => {}),
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

      {open && <DropDown label={userName} actions={items} />}

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
