// src\app\components\header\RightSection.tsx

"use client";

import styles from "./RightSection.module.css";
import UserDropdown from "@/app/components/header/UserDropdown";
import NotificationsDropdown from "@/app/components/header/NotificationsDropDown";
import SettingsDropdown from "@/app/components/header/SettingsDropdown";
import { Bell, Moon, Sun } from "lucide-react";
import IconToggleButton from "@/app/components/common/IconTogggleButton";
import { Notification } from "@/app/types/notification.types";

interface RightSectionProps {
  userName: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  onLogout: () => void;
  onToggleTheme: (darkMode: boolean) => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onAbout?: () => void;
  onAdminPanel?: () => void;
  onClearFavorites: () => void;
  onClearLocked: () => void;
  onClearHidden: () => void;
  onResetToDefault: () => void;
  notifications: Notification[];
}

export default function RightSection({
  userName,
  avatarUrl,
  isAdmin = false,
  onLogout,
  onToggleTheme,
  onProfile,
  onSettings,
  onAbout,
  onAdminPanel,
  onClearFavorites,
  onClearLocked,
  onClearHidden,
  onResetToDefault,
  notifications,
}: RightSectionProps) {
  return (
    <div className={styles.rightSection}>
      <NotificationsDropdown
        notifications={notifications}
        onMarkAsRead={(id) => {
          console.log("Marking as read:", id);
        }}
        onDismiss={(id) => {
          console.log("Dismissing notification:", id);
        }}
      />

      <SettingsDropdown
        onClearFavorites={onClearFavorites}
        onClearLocked={onClearLocked}
        onClearHidden={onClearHidden}
        onResetToDefault={onResetToDefault}
        onLogout={onLogout}
      />

      <IconToggleButton
        onToggle={onToggleTheme}
        onIcon={<Moon size={18} />}
        offIcon={<Sun size={18} />}
        ariaLabel="Theme Toggle"
      />

      <div className={styles.userArea}>
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt="User Avatar"
          className={styles.avatar}
        />
        <span className={styles.userName}>{userName}</span>
        <UserDropdown
          userName={userName}
          isAdmin={isAdmin}
          onLogout={onLogout}
          onProfile={onProfile}
          onSettings={onSettings}
          onAbout={onAbout}
          onAdminPanel={onAdminPanel}
        />
      </div>
    </div>
  );
}
