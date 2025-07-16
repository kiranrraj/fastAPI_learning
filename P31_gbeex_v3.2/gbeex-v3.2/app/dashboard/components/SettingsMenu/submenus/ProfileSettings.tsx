import React, { useContext } from "react";
import {
  SettingsContext,
  SettingsContextType,
} from "@/app/contexts/settings/SettingsContext";
import { Image as ImageIcon } from "lucide-react";
import styles from "../SettingsMenu.module.css";

export default function ProfileSettings() {
  const { settings, updateSettings } = useContext(
    SettingsContext
  ) as SettingsContextType;

  // This is a local handler. In a real app, you'd have more logic here.
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...settings,
      profile: { ...settings.profile, name: e.target.value },
    });
  };

  return (
    <div className={styles.subMenuList}>
      <div className={styles.subMenuItem}>
        <label htmlFor="profile-name">Name</label>
        <input
          id="profile-name"
          type="text"
          value={settings.profile.name}
          onChange={handleNameChange}
        />
      </div>
      <div className={styles.subMenuItem}>
        <button className={styles.photoButton}>
          <ImageIcon size={16} />
          <span>Change Photo</span>
        </button>
      </div>
    </div>
  );
}
