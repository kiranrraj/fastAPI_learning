"use client";

import React, { ReactNode } from "react";
import { AppInfoContext, AppInfoContextType } from "./AppInfoContext";

// This component provides general app information to its children
export const AppInfoProvider = ({ children }: { children: ReactNode }) => {
  // This data is static or has simple logic, so we define it directly
  const appVersion = "2.1.5";

  const handleContactAdmin = () => {
    alert("Contact Admin action triggered!");
  };

  // The value object contains the app version and the contact function
  const value: AppInfoContextType = {
    appVersion,
    handleContactAdmin,
  };

  return (
    <AppInfoContext.Provider value={value}>{children}</AppInfoContext.Provider>
  );
};
