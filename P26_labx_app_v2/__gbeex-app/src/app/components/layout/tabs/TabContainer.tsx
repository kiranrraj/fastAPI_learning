import React from "react";
import { TabMeta } from "@/app/types/tab.types";
import IconClose from "../../icons/IconClose";
import IconStar from "../../icons/IconStar";
import IconStarFilled from "../../icons/IconStarFilled";

interface TabContainerProps {
  tabs: TabMeta[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onToggleFavorite: (tabId: string) => void;
  renderTabContent: (tab: TabMeta) => React.ReactNode;
}

const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onToggleFavorite,
  renderTabContent,
}) => {
  // Find the currently active tab object
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-full">
      {/* ────────────────────────────────────────────── */}
      {/* TOP: Tab Headers Bar */}
      {/* ────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto border-b bg-gray-100 px-2 py-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            // Each individual tab button
            <div
              key={tab.id}
              className={`flex bg-black items-center gap-2 px-3 py-1 rounded-md cursor-pointer 
                ${
                  isActive
                    ? "bg-black text-white border border-gray-400 font-semibold shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              onClick={() => onTabClick(tab.id)}
            >
              {/* Tab Title */}
              <span className="truncate max-w-[150px]">
                {tab.title || "Untitled"}
              </span>

              {/* Favorite Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(tab.id);
                }}
                className="text-xs text-yellow-500 hover:text-yellow-600"
                aria-label="Toggle favorite"
              >
                {tab.pinned ? <IconStar filled={tab.pinned} /> : <IconStar />}
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="text-xs text-red-500 hover:text-red-700"
                aria-label="Close tab"
              >
                <IconClose />
              </button>
            </div>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────── */}
      {/* BOTTOM: Tab Content Area */}
      {/* ────────────────────────────────────────────── */}
      <div className="flex-1 bg-color overflow-auto">
        {activeTab ? renderTabContent(activeTab) : <div>No tab selected</div>}
      </div>
    </div>
  );
};

export default React.memo(TabContainer);
