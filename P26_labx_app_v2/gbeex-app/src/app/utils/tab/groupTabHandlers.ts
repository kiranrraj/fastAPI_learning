// src/app/utils/tab/groupTabHandlers.ts

import { SharedTabHandlerOptions } from "@/app/types/tab.types";
import { createGenericTabOpener } from "./genericTabHandler";

// Group type representing a portlet group (parent).
interface Group {
    id: string;
    name: string;
}
/**
 * Creates a handler for opening "group" (portlet group) tabs.
 * Input: SharedTabHandlerOptions: { tabs, setActiveTabId, openTab }
 * Output: openGroupTab: (group: { id, name }) => void, Internally reuses generic tab opener utility.
 */
export function createGroupTabHandlers(options: SharedTabHandlerOptions) {
    const openGenericTab = createGenericTabOpener(
        options.tabs,
        options.setActiveTabId,
        options.openTab
    );

    // Opens or focuses a tab for a specific group.
    function openGroupTab(group: Group) {
        openGenericTab(group, "group");

        // For testing:
        // console.log("[GroupTabHandler] openGroupTab called with:", group);
    }

    return { openGroupTab };
}



// import { TabType } from "@/app/types/tab.types";
// interface Group {
//     id: string;
//     name: string;
//     children?: any[];
// }
// // CORRECT: This is the expected shape from tabHandlers.ts
// export interface GroupTabHandlerOptions {
//     tabs: TabType[];
//     setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
//     openTab: (tab: TabType) => void;
// }

// export function createGroupTabHandlers({
//     tabs,
//     setActiveTabId,
//     openTab,
// }: GroupTabHandlerOptions) {
//     function openGroupTab(group: Group) {
//         const tabId = `group-${group.id}`;
//         const existing = tabs.find((tab) => tab.id === tabId);

//         if (existing) {
//             setActiveTabId(tabId);
//             return;
//         }

//         openTab({
//             id: tabId,
//             type: "group",
//             title: group.name,
//             pinned: false,
//             data: group,
//         });
//     }

//     return { openGroupTab };
// }
