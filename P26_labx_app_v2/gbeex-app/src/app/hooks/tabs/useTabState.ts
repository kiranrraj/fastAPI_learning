// src/app/hooks/tabs/useTabState.ts

import { useState } from "react";
import { TabType } from "@/app/types/tab.types";

export function useTabState() {
    const [tabs, setTabs] = useState<TabType[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const [closedStack, setClosedStack] = useState<TabType[]>([]);

    return {
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        closedStack,
        setClosedStack,
    };
}
