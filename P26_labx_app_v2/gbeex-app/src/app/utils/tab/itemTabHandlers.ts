// src/app/utils/tab/itemTabHandlers.ts

// src/app/utils/tab/itemTabHandlers.ts

import { SharedTabHandlerOptions } from "@/app/types/tab.types";
import { createGenericTabOpener } from "./genericTabHandler";

// Item type representing a portlet item (child).
interface Item {
    id: string;
    name: string;
}

/**
 * Creates a handler for opening "item" (child portlet) tabs.
 * Input: SharedTabHandlerOptions: { tabs, setActiveTabId, openTab }
 * Output: openItemTab: (item: { id, name }) => void, Internally reuses generic tab opener utility.
 */
export function createItemTabHandlers(options: SharedTabHandlerOptions) {
    const openGenericTab = createGenericTabOpener(
        options.tabs,
        options.setActiveTabId,
        options.openTab
    );

    // Opens or focuses a tab for a specific item.
    function openItemTab(item: Item) {
        openGenericTab(item, "item");

        // For testing:
        // console.log("[ItemTabHandler] openItemTab called with:", item);
    }

    return { openItemTab };
}




// import { TabType } from "@/app/types/tab.types";
// interface Item {
//     id: string;
//     name: string;
// }
// export interface ItemTabHandlerOptions {
//     tabs: TabType[];
//     setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
//     openTab: (tab: TabType) => void;
// }
// export function createItemTabHandlers({
//     tabs,
//     setActiveTabId,
//     openTab,
// }: ItemTabHandlerOptions) {
//     function openItemTab(item: Item) {
//         const tabId = `item-${item.id}`;
//         const existing = tabs.find((tab) => tab.id === tabId);

//         if (existing) {
//             setActiveTabId(tabId);
//             return;
//         }

//         openTab({
//             id: tabId,
//             type: "item",
//             title: item.name,
//             pinned: false,
//             data: item,
//         });
//     }

//     return { openItemTab };
// }
