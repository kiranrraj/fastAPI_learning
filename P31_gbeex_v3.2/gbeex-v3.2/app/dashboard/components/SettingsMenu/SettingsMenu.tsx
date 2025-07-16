import React, { useState, useContext } from "react";
import {
  Settings,
  UserCircle,
  ShieldCheck,
  Bell,
  SlidersHorizontal,
  Accessibility,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import GenericDropdown from "@/app/components/shared/GenericDropdown";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/settings/SettingsContext";
import { UserContext, UserContextType } from "@/app/contexts/user/UserContext";
import { SettingsCategory } from "@/app/types";
import styles from "./SettingsMenu.module.css";

// Import all the sub-menu components
import ProfileSettings from "./submenus/ProfileSettings";
import SecuritySettings from "./submenus/SecuritySettings";
import NotificationSettings from "./submenus/NotificationSettings";
import PreferenceSettings from "./submenus/PreferenceSettings";
import AccessibilitySettings from "./submenus/AccessibilitySettings";

export default function SettingsMenu() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;
  const { handleLogout } = useContext(UserContext) as UserContextType;
  const [activeSubMenu, setActiveSubMenu] = useState<SettingsCategory | null>(
    null
  );

  const handleSave = () => {
    // In a real app, you might only save the changed part of the settings object
    updateSettings(settings);
    alert(`${activeSubMenu} settings saved!`);
  };

  const renderSubMenu = () => {
    if (!activeSubMenu) return null;

    const subMenuMap = {
      profile: <ProfileSettings />,
      security: <SecuritySettings />,
      notifications: <NotificationSettings />,
      preferences: <PreferenceSettings />,
      accessibility: <AccessibilitySettings />,
    };

    return (
      <div className={styles.subMenuPane}>
        <div className={styles.subMenuHeader}>
          <button
            onClick={() => setActiveSubMenu(null)}
            className={styles.subMenuBack}
            aria-label="Back to settings"
          >
            <ArrowLeft size={16} />
          </button>
          <h4 className={styles.subMenuTitle}>
            {activeSubMenu.charAt(0).toUpperCase() + activeSubMenu.slice(1)}
          </h4>
        </div>
        <div className={styles.subMenuListWrapper}>
          {subMenuMap[activeSubMenu]}
        </div>
        <div className={styles.subMenuFooter}>
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    );
  };

  const trigger = (
    <button className={styles.iconButton} aria-label="Settings">
      <Settings size={20} />
    </button>
  );

  const content = (
    <div
      className={`${styles.settingsMenuWrapper} ${
        activeSubMenu ? styles.subMenuActive : ""
      }`}
    >
      <div className={styles.mainMenuPane}>
        <ul className={styles.menuList}>
          <li>
            <button
              className={styles.menuItem}
              onClick={() => setActiveSubMenu("profile")}
            >
              <div className={styles.itemContent}>
                <UserCircle size={18} className={styles.itemIcon} />
                <span>Profile</span>
              </div>
              <ChevronRight size={16} className={styles.itemChevron} />
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={() => setActiveSubMenu("security")}
            >
              <div className={styles.itemContent}>
                <ShieldCheck size={18} className={styles.itemIcon} />
                <span>Security</span>
              </div>
              <ChevronRight size={16} className={styles.itemChevron} />
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={() => setActiveSubMenu("notifications")}
            >
              <div className={styles.itemContent}>
                <Bell size={18} className={styles.itemIcon} />
                <span>Notifications</span>
              </div>
              <ChevronRight size={16} className={styles.itemChevron} />
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={() => setActiveSubMenu("preferences")}
            >
              <div className={styles.itemContent}>
                <SlidersHorizontal size={18} className={styles.itemIcon} />
                <span>Preferences</span>
              </div>
              <ChevronRight size={16} className={styles.itemChevron} />
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={() => setActiveSubMenu("accessibility")}
            >
              <div className={styles.itemContent}>
                <Accessibility size={18} className={styles.itemIcon} />
                <span>Accessibility</span>
              </div>
              <ChevronRight size={16} className={styles.itemChevron} />
            </button>
          </li>
          <li className={styles.menuSeparator}></li>
          <li>
            <button
              className={`${styles.menuItem} ${styles.menuLogoutButton}`}
              onClick={handleLogout}
            >
              <div className={styles.itemContent}>
                <LogOut size={18} className={styles.itemIcon} />
                <span>Logout</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
      {renderSubMenu()}
    </div>
  );

  return <GenericDropdown trigger={trigger}>{content}</GenericDropdown>;
}
