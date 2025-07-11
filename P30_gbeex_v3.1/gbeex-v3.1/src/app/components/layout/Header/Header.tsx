// --- Icon Components (usage replacement for Header.tsx) ---
import React, { useState } from "react";
import Button from "@/app/components/ui/Buttons/Button";
import UserMenu from "@/app/components/ui/UserMenu/UserMenu";
import NotificationBell from "@/app/components/ui/NotificationDropDown/NotificationBell";
import HelpButton from "@/app/components/ui/HelpButton/HelpButton";
import { HeaderProps } from "@/app/types/dashboard.types";
import LogoIcon from "@/app/components/Icons/LogoIcon";
import SidebarToggleIcon from "@/app/components/Icons/SidebarToggleIcon";
import SettingsIcon from "@/app/components/Icons/SettingsIcon";
import OrientationIcon from "@/app/components/Icons/OrientationIcon";
import LogOutIcon from "@/app/components/Icons/LogOutIcon";
import styles from "@/app/components/layout/Header/Header.module.css";

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const [isVertical, setIsVertical] = useState(false);
  const [isAppSidebarOpen, setIsAppSidebarOpen] = useState(true);

  const handleToggleOrientation = () => setIsVertical((prev) => !prev);
  const handleToggleAppSidebar = () => setIsAppSidebarOpen((prev) => !prev);

  const headerClassName = `${styles["header-container"]} ${
    isVertical
      ? styles["header-container--vertical"]
      : styles["header-container--horizontal"]
  }`;

  return (
    <header className={headerClassName}>
      {/* Left Section */}
      <div className={styles["header-left-section"]}>
        <div className={styles["header-logo-area"]}>
          <LogoIcon size={28} className={styles["header-logo"]} />
          <span className={styles["header-app-name"]}>AppName</span>
        </div>
        <Button
          variant="icon"
          aria-label="Toggle App Sidebar"
          onClick={handleToggleAppSidebar}
        >
          <SidebarToggleIcon />
        </Button>
      </div>

      {/* Right Section */}
      <div className={styles["header-right-section"]}>
        <UserMenu user={user} />
        <NotificationBell />
        <HelpButton />
        <Button variant="icon" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <div className={styles["separator"]}></div>
        <Button
          variant="icon"
          aria-label="Toggle Header Orientation"
          onClick={handleToggleOrientation}
        >
          <OrientationIcon />
        </Button>
        <Button
          className={styles["logout-button"]}
          aria-label="Sign Out"
          onClick={onSignOut}
        >
          <LogOutIcon />
          <span className={styles["logout-text"]}>Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
