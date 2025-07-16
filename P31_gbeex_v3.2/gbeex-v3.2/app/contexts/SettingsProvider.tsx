// \gbeex-v3.2\app\contexts\SettingsProvider.tsx

"use client";

import React, { useState, ReactNode } from "react";
import { SettingsContext, SettingsContextType } from "./SettingsContext";
import { AppSettings } from "@/app/types";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // State for holding the entire settings object
  const [settings, setSettings] = useState<AppSettings>({
    profile: { name: "Kiran Raj" },
    security: { password: "", confirm: "" },
    notifications: {
      silentMode: false,
      emailNotification: true,
      retentionDays: 30,
      maxCount: 30,
    },
    preferences: {
      reportFormat: "CSV",
      maxFav: 10,
      maxTabs: 10,
      maxHidden: 10,
    },
    accessibility: {
      theme: "light",
      fontSize: "medium",
      animations: true,
      highContrast: false,
    },
  });

  // Function to update the settings
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    alert("Settings have been updated!");
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
