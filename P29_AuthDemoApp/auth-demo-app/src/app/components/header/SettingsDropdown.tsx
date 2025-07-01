// src\app\components\header\SettingsDropdown.tsx

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
import DropDown from "@/app/components/common/DropDown";
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

  const settingsItems = [
    {
      label: "Clear Favorites",
      icon: <HeartOff size={16} />,
      action: onClearFavorites,
      tooltip: "Remove all favorite tabs",
    },
    {
      label: "Clear Locked",
      icon: <Lock size={16} />,
      action: onClearLocked,
      tooltip: "Unlock all locked tabs",
    },
    {
      label: "Clear Hidden",
      icon: <EyeOff size={16} />,
      action: onClearHidden,
      tooltip: "Unhide all hidden tabs",
    },
    {
      label: "Reset to Default",
      icon: <RotateCcw size={16} />,
      action: onResetToDefault,
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

      {open && (
        <DropDown
          label="Settings"
          options={settingsItems.map((item) => item.label)}
          onSelect={(label) => {
            const found = settingsItems.find((item) => item.label === label);
            if (found) found.action();
            setOpen(false);
          }}
          icons={settingsItems.map((item) => item.icon)}
          tooltips={settingsItems.map((item) => item.tooltip)}
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
