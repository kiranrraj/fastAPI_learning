// src/app/components/header/SettingsDropdown.tsx

"use client";

import { useState } from "react";
import {
  Settings2,
  RefreshCw,
  Lock,
  EyeOff,
  HeartOff,
  RotateCcw,
  LogOut,
} from "lucide-react";
import DropDown, { DropDownAction } from "@/app/components/common/DropDown";
import styles from "./SettingsDropdown.module.css";

interface SettingsDropdownProps {
  onClearFavorites: () => void;
  onClearLocked: () => void;
  onClearHidden: () => void;
  onResetToDefault: () => void;
  onLogout: () => void;
}

export default function SettingsDropdown({
  onClearFavorites,
  onClearLocked,
  onClearHidden,
  onResetToDefault,
  onLogout,
}: SettingsDropdownProps) {
  const [open, setOpen] = useState(false);

  const settingsItems: DropDownAction[] = [
    {
      label: "Clear Favorites",
      icon: HeartOff,
      onClick: onClearFavorites,
      tooltip: "Remove all favorite tabs",
    },
    {
      label: "Clear Locked",
      icon: Lock,
      onClick: onClearLocked,
      tooltip: "Unlock all locked tabs",
    },
    {
      label: "Clear Hidden",
      icon: EyeOff,
      onClick: onClearHidden,
      tooltip: "Unhide all hidden tabs",
    },
    {
      label: "Reset to Default",
      icon: RotateCcw,
      onClick: onResetToDefault,
      tooltip: "Restore default view",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.settingsButton}
        onClick={() => setOpen(!open)}
        aria-label="Settings"
        title="Settings"
      >
        <Settings2 size={20} />
      </button>

      {open && <DropDown label="Settings" actions={settingsItems} />}

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
