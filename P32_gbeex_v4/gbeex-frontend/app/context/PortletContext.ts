// app/context/PortletContext.tsx
import { createContext } from "react";
import type { Portlet, PortletBase } from "@/app/types/portlet";
import type { Tab } from "@/app/types/tab";

export interface PortletContextType {
    /** All portlets fetched from the server */
    portlets: Portlet[];
    /** Re-fetch portlets from GET /api/v1/portlets */
    fetchPortlets: () => Promise<void>;

    /** The open tabs in the content area */
    openTabs: Tab[];
    /** Which tab is currently active */
    activeTabId: string;
    /** Open a portlet or custom tab */
    openTab: (tab: Tab) => void;
    /** Close a tab by its id */
    closeTab: (id: string) => void;
    /** Switch to a different tab */
    setActiveTabId: (id: string) => void;

    /** Create a new portlet via POST /api/v1/portlets and open it */
    registerPortlet: (p: PortletBase) => Promise<void>;
}

export const PortletContext = createContext<PortletContextType>({
    portlets: [],
    fetchPortlets: async () => { },

    openTabs: [],
    activeTabId: "",
    openTab: () => { },
    closeTab: () => { },
    setActiveTabId: () => { },

    registerPortlet: async () => { },
});
