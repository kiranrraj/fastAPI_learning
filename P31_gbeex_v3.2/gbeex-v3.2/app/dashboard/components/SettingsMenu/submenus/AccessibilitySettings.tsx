import React, { useContext } from "react";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/settings/SettingsContext";
import styles from "../SettingsMenu.module.css";

export default function AccessibilitySettings() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;
  return (
    <div className={styles.subMenuList}>
      <div className={styles.subMenuItem}>
        <label>Theme</label>
        <div className={styles.radioGroup}>
          <label>
            <input type="radio" name="theme" defaultChecked /> Light
          </label>
          <label>
            <input type="radio" name="theme" /> Dark
          </label>
        </div>
      </div>
      <div className={styles.subMenuItem}>
        <label>Font Size</label>
        <div className={styles.radioGroup}>
          <label>
            <input type="radio" name="font" /> S
          </label>
          <label>
            <input type="radio" name="font" defaultChecked /> M
          </label>
          <label>
            <input type="radio" name="font" /> L
          </label>
        </div>
      </div>
      <div className={`${styles.subMenuItem} ${styles.toggleContainer}`}>
        <label htmlFor="disable-animations">Disable Animations</label>
        <input id="disable-animations" type="checkbox" />
      </div>
      <div className={`${styles.subMenuItem} ${styles.toggleContainer}`}>
        <label htmlFor="high-contrast">High Contrast Mode</label>
        <input id="high-contrast" type="checkbox" />
      </div>
    </div>
  );
}
