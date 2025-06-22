"use client"; // Ensures client-side interactivity

import React from "react";
import { TabType } from "@/app/types/tab.types";
import IconClose from "../../icons/IconClose";
import StarIcon from "@/app/components/icons/IconStar";

interface TabHeaderBarProps {
  tabs: TabType[]; // All open tabs
  activeTabId: string | null; // Currently selected tab
  onTabClick: (tabId: string) => void; // Switch focus to this tab
  onTabClose: (tabId: string) => void; // Close this tab
  onToggleFavorite?: (tabId: string) => void; // Toggle favorite status
}

const TabHeaderBar: React.FC<TabHeaderBarProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onToggleFavorite,
}) => {
  // Sort tabs: pinned (favorite) first
  const sortedTabs = [...tabs].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    return bPinned - aPinned; // pinned tabs first
  });

  return (
    <div
      className="flex items-center border-b bg-gray-100 dark:bg-gray-800 px-2 py-1 space-x-1 overflow-x-auto"
      role="tablist"
      aria-label="Open tabs"
    >
      {sortedTabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-1 rounded-t-md text-sm cursor-pointer transition-all
            ${
              tab.id === activeTabId
                ? "bg-white dark:bg-gray-900 font-semibold"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          onClick={() => onTabClick(tab.id)}
          role="tab"
          aria-selected={tab.id === activeTabId}
          title={tab.title} // Tooltip on hover
        >
          {/* Tab title */}
          <span className="truncate max-w-[120px] mx-2">{tab.title}</span>

          {/* Favorite toggle button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent tab activation
                onToggleFavorite(tab.id);
              }}
              title={tab.pinned ? "Remove from favorites" : "Add to favorites"}
              aria-label={`Toggle favorite for ${tab.title}`}
              className="ml-1"
            >
              <StarIcon filled={tab.pinned} size={16} />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-1 text-xs text-gray-400 hover:text-red-500"
            title="Close tab"
            aria-label={`Close ${tab.title}`}
          >
            <IconClose />
          </button>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TabHeaderBar);
