// src\app\components\tab\TabManager.tsx

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Tab } from "./tabs.types";
import TabScroller from "./TabScroller";
import TabContainer from "./TabContainer";
import TabContent from "./TabContent";
import styles from "./TabManager.module.css";
import { Search, RotateCw } from "lucide-react";

interface TabManagerProps {
  initialTabs: Tab[];
  onTabCloseExternal?: (id: string) => void;
}

export default function TabManager({
  initialTabs,
  onTabCloseExternal,
}: TabManagerProps) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialTabs.find((tab) => tab.isActive)?.id || initialTabs[0]?.id || null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedTabId, setHighlightedTabId] = useState<string | null>(null);
  const closedTabsRef = useRef<Tab[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    setActiveTabId(id);
    setHighlightedTabId(null); // clear highlight on manual click
  };

  const handleClose = (id: string) => {
    setTabs((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      const closed = prev.find((t) => t.id === id);
      if (closed) closedTabsRef.current.push(closed);
      if (activeTabId === id && updated.length > 0) {
        setActiveTabId(updated[0].id);
      } else if (updated.length === 0) {
        setActiveTabId(null);
      }
      return updated;
    });

    if (onTabCloseExternal) onTabCloseExternal(id);
  };

  const toggleFavorite = useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, isFavorite: !tab.isFavorite } : tab
      )
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, isLocked: !tab.isLocked } : tab
      )
    );
  }, []);

  const restoreLastClosedTab = () => {
    const last = closedTabsRef.current.pop();
    if (last) {
      setTabs((prev) => [...prev, last]);
      setActiveTabId(last.id);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setHighlightedTabId(null);
      return;
    }

    const match = tabs.find(
      (tab) =>
        tab.title.toLowerCase().includes(query) ||
        (typeof tab.content === "string" &&
          tab.content.toLowerCase().includes(query))
    );

    if (match) {
      setHighlightedTabId(match.id);
      setActiveTabId(match.id);
      // Attempt to scroll to tab header element
      setTimeout(() => {
        const el = document.getElementById(`tab-${match.id}`);
        el?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }, 200);
    } else {
      setHighlightedTabId(null);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.topBar}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tabs..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <button
          className={styles.restoreButton}
          onClick={restoreLastClosedTab}
          title="Restore last closed tab"
        >
          <RotateCw size={16} />
        </button>
      </div>

      <TabScroller>
        <TabContainer
          tabs={tabs.map((tab) => ({
            ...tab,
            isActive: tab.id === activeTabId,
            isHighlighted: tab.id === highlightedTabId,
          }))}
          onTabSelect={handleSelect}
          onTabClose={handleClose}
          onTabToggleFavorite={toggleFavorite}
          onTabToggleLock={toggleLock}
        />
      </TabScroller>

      <TabContent activeTab={activeTab} />
    </div>
  );
}
