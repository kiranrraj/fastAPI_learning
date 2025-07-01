// src/app/components/layout/header/SettingsMenu.tsx
"use client";

import React from "react";
import { Settings } from "lucide-react";
import styles from "./SettingsMenu.module.css";

const SettingsMenu: React.FC = () => {
  return (
    <div className={styles.settingsWrapper} title="Settings">
      <button className={styles.settingsButton}>
        <Settings size={20} />
      </button>
    </div>
  );
};

export default SettingsMenu;
