import { createContext, useContext, useState, ReactNode } from "react";
import { PortletNode } from "@/app/types/common/portlet.types";

interface AppShellState {
  tabs: PortletNode[];
  activeTabId: string | null;
  lastClosedTab: PortletNode | null;
  favorites: PortletNode[];
  searchQuery: string;
  visibleSidebarItems: PortletNode[];
  user: { name: string; email: string } | null;
  theme: "light" | "dark";
}

interface AppShellContextType {
  state: AppShellState;
  setState: React.Dispatch<React.SetStateAction<AppShellState>>;
}

const AppShellContext = createContext<AppShellContextType | undefined>(
  undefined
);

export const AppShellProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppShellState>({
    tabs: [],
    activeTabId: null,
    lastClosedTab: null,
    favorites: [],
    searchQuery: "",
    visibleSidebarItems: [],
    user: null,
    theme: "light",
  });

  return (
    <AppShellContext.Provider value={{ state, setState }}>
      {children}
    </AppShellContext.Provider>
  );
};

export const useAppShellState = () => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShellState must be used within AppShellProvider");
  }
  return context;
};
