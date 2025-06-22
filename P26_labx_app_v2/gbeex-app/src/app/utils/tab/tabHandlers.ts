import { TabType } from "@/app/types/tab.types";

// Handler functions for managing tab state.
export function createTabHandlers({
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
    // Opens a new tab or focuses it if it already exists.
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

    // Closes a tab by ID and stores it in the closedStack.
    function closeTab(tabId: string) {
        setTabs((prev) => {
            const toClose = prev.find((t) => t.id === tabId);
            if (toClose) {
                setClosedStack((stack) => [toClose, ...stack]);
            }

            const next = prev.filter((t) => t.id !== tabId);

            if (activeTabId === tabId) {
                setActiveTabId(next.length ? next[next.length - 1].id : null);
            }

            return next;
        });
    }

    // Restores the most recently closed tab from the stack.
    function restoreLastClosed() {
        setClosedStack((stack) => {
            if (stack.length === 0) return stack;

            const [last, ...rest] = stack;
            setTabs((prev) => [...prev, last]);
            setActiveTabId(last.id);
            return rest;
        });
    }

    // Updates the content or state of a tab by merging fields.
    // We take the old tab, apply the updates on top of it, and replace the old version in the state array.
    function updateTab(tabId: string, updates: Partial<TabType>) {
        setTabs((prev) =>
            prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
        );
    }

    return {
        openTab,
        closeTab,
        restoreLastClosed,
        updateTab,
    };
}
