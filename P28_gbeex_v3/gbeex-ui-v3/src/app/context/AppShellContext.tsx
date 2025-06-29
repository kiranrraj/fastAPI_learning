"use client";

import React, { createContext, useContext, useState } from "react";
import { AppShellState } from "@/app/types/appShellState.types";
import { defaultAppShellState } from "@/app/types/defaultAppShellState";

// Context type: provides state and state updater
interface AppShellContextType {
  state: AppShellState;
  setState: React.Dispatch<React.SetStateAction<AppShellState>>;
}

// Create the context
const AppShellContext = createContext<AppShellContextType | undefined>(
  undefined
);

// Provider component that wraps the entire application
export const AppShellProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppShellState>(defaultAppShellState);

  return (
    <AppShellContext.Provider value={{ state, setState }}>
      {children}
    </AppShellContext.Provider>
  );
};

// Custom hook to access shared AppShell state from any component
export const useAppShellState = (): AppShellContextType => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShellState must be used within AppShellProvider");
  }
  return context;
};
