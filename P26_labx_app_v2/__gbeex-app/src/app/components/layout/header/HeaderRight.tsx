// src/app/components/layout/header/HeaderRight.tsx

import React from "react";
import UserProfile from "@/app/components/layout/header/UserProfile";
import LogoutButton from "@/app/components/layout/header/LogoutButton";
import HelpButton from "@/app/components/layout/header/HelpButton";
import NotificationButton from "@/app/components/layout/header/NotificationButton";
import SettingsButton from "@/app/components/layout/header/SettingsButton";
import ThemeToggle from "@/app/components/ui/ThemeToggle"; // ← updated
import styles from "@/app/components/styles/header/HeaderRight.module.css";

const HeaderRight: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`flex items-center gap-2 ${styles.headerRight} ${className}`}
    >
      <UserProfile name="John Doe" avatarUrl="/avatar-placeholder.png" />
      <NotificationButton hasUnread />
      <SettingsButton />
      <ThemeToggle /> {/* ← updated usage */}
      <HelpButton />
      <LogoutButton />
    </div>
  );
};

export default React.memo(HeaderRight);
