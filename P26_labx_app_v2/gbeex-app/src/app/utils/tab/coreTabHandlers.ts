// src/app/utils/tab/coreTabHandlers.ts

import { TabType } from "@/app/types/tab.types";

export interface CoreTabHandlerOptions {
    tabs: TabType[];
    setTabs: React.Dispatch<React.SetStateAction<TabType[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    closedStack: TabType[];
    setClosedStack: React.Dispatch<React.SetStateAction<TabType[]>>;
}

export function createCoreTabHandlers({
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    closedStack,
    setClosedStack,
}: CoreTabHandlerOptions) {
    function openTab(newTab: TabType) {
        setTabs((prev) => {
            const exists = prev.find((t) => t.id === newTab.id);
            if (exists) {
                setActiveTabId(newTab.id);
                return prev;
            }
            setActiveTabId(newTab.id);
            return [...prev, newTab];
        });
    }

    function closeTab(tabId: string) {
        setTabs((prev) => {
            const toClose = prev.find((t) => t.id === tabId);
            if (toClose) setClosedStack((stack) => [toClose, ...stack]);

            const next = prev.filter((t) => t.id !== tabId);
            if (activeTabId === tabId) {
                setActiveTabId(next.length ? next[next.length - 1].id : null);
            }

            return next;
        });
    }

    function restoreLastClosed() {
        setClosedStack((stack) => {
            if (stack.length === 0) return stack;

            const [last, ...rest] = stack;
            setTabs((prev) => [...prev, last]);
            setActiveTabId(last.id);
            return rest;
        });
    }

    function updateTab(tabId: string, updates: Partial<TabType>) {
        setTabs((prev) =>
            prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
        );
    }

    return { openTab, closeTab, restoreLastClosed, updateTab };
}
