"use client";

import { createContext } from "react";
import { AppInfo } from "@/app/types";

// 1. Define the context's shape, which is the AppInfo type itself
export type AppInfoContextType = AppInfo;

// 2. Create the context for app-wide information
export const AppInfoContext = createContext<AppInfoContextType | null>(null);
