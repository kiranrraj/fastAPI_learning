import React, { useContext } from "react";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/SettingsContext";
import styles from "../SettingsMenu.module.css";

export default function SecuritySettings() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;
  return (
    <div className={styles.subMenuList}>
      <div className={styles.subMenuItem}>
        <label htmlFor="new-password">New Password</label>
        <input id="new-password" type="password" placeholder="••••••••" />
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input id="confirm-password" type="password" placeholder="••••••••" />
      </div>
    </div>
  );
}
