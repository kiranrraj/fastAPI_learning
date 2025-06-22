import { TabType } from "@/app/types/tab.types";

export type OpenTabFunction = (tab: TabType) => void;

/**
 * Creates a reusable tab-opening function for both group and item types.
 *
 * @param tabs - Array of currently open tabs
 * @param setActiveTabId - Function to activate a given tab
 * @param openTab - Function to open a new tab (from core handler)
 * @returns openGenericTab - A handler that opens or focuses a tab
 *
 * @example
 * const openGenericTab = createGenericTabOpener(tabs, setActiveTabId, openTab);
 * openGenericTab({ id: "grp-001", name: "Data Science" }, "group");
 */
export function createGenericTabOpener(
    tabs: TabType[],
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>,
    openTab: OpenTabFunction
) {
    return function openGenericTab(
        item: { id: string; name: string },
        tabType: "group" | "item"
    ) {
        const tabId = `${tabType}-${item.id}`;
        const existing = tabs.find((tab) => tab.id === tabId);

        if (existing) {
            setActiveTabId(tabId);
            // console.log(`[TAB] Focused existing ${tabType} tab:`, tabId);
            return;
        }

        openTab({
            id: tabId,
            type: tabType,
            title: item.name,
            pinned: false,
            data: item,
        });

        // console.log(`[TAB] Opened new ${tabType} tab:`, tabId);
    };
}
