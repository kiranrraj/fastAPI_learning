// src/app/utils/tab/tabHandlers.ts

import { TabType } from "@/app/types/tab.types";
import { createCoreTabHandlers } from "./coreTabHandlers";
import { createGroupTabHandlers } from "./groupTabHandlers";
import { createItemTabHandlers } from "./itemTabHandlers";
import { createFavoriteHandlers } from "./favoriteTabHandler";

export function createTabHandlersBundle({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
}: {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}) {
    // Get core tab functions like openTab, closeTab, etc.
    const core = createCoreTabHandlers({
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        closedStack,
        setClosedStack,
    });

    // Compose final set of utilities
    return {
        ...core,
        ...createGroupTabHandlers({
            tabs,
            setActiveTabId,
            openTab: core.openTab,
        }),
        ...createItemTabHandlers({
            tabs,
            setActiveTabId,
            openTab: core.openTab,
        }),
        ...createFavoriteHandlers({
            tabs,
            updateTab: core.updateTab,
        }),
    };
}
