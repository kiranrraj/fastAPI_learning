import React, { useContext } from "react";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/settings/SettingsContext";
import styles from "../SettingsMenu.module.css";

export default function NotificationSettings() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;
  return (
    <div className={styles.subMenuList}>
      <div className={`${styles.subMenuItem} ${styles.toggleContainer}`}>
        <label htmlFor="silent-mode">Silent Mode</label>
        <input id="silent-mode" type="checkbox" />
      </div>
      <div className={`${styles.subMenuItem} ${styles.toggleContainer}`}>
        <label htmlFor="email-notifications">Email Notifications</label>
        <input id="email-notifications" type="checkbox" defaultChecked />
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="retention-days">Retention Days (7-60)</label>
        <input
          id="retention-days"
          type="number"
          min="7"
          max="60"
          defaultValue="30"
        />
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="max-count">Max Notifications (15-50)</label>
        <input
          id="max-count"
          type="number"
          min="15"
          max="50"
          defaultValue="30"
        />
      </div>
    </div>
  );
}
