import React, { useContext } from "react";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/settings/SettingsContext";
import styles from "../SettingsMenu.module.css";

export default function PreferenceSettings() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;
  return (
    <div className={styles.subMenuList}>
      <div className={styles.subMenuItem}>
        <label htmlFor="report-format">Default Report Format</label>
        <select id="report-format" defaultValue="CSV">
          <option>PDF</option>
          <option>CSV</option>
          <option>Excel (.xlsx)</option>
        </select>
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="max-fav">Max Favorites (5-15)</label>
        <input id="max-fav" type="number" min="5" max="15" defaultValue="10" />
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="max-tabs">Max Open Tabs (5-15)</label>
        <input id="max-tabs" type="number" min="5" max="15" defaultValue="10" />
      </div>
      <div className={styles.subMenuItem}>
        <label htmlFor="max-hidden">Max Hidden Items (5-15)</label>
        <input
          id="max-hidden"
          type="number"
          min="5"
          max="15"
          defaultValue="10"
        />
      </div>
    </div>
  );
}
