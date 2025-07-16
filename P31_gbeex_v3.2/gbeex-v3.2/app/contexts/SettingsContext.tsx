"use client";

import { createContext } from "react";
import { AppSettings } from "@/app/types";

// 1. Defines the "shape" of the context's value
export type SettingsContextType = {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
};

// 2. Creates the context that components will use to subscribe to settings data
export const SettingsContext = createContext<SettingsContextType | null>(null);
