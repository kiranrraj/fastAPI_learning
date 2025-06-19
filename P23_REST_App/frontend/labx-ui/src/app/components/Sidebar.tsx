"use client";

import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import styles from "./Sidebar.module.css";
import { Tab } from "../types/tabTypes";

import {
  fetchGroupedInvestigations,
  fetchInvestigationById,
} from "../../services/api";

import {
  tabExists,
  getInitialCollapsedMap,
  filterGroupsWithSearch,
} from "../utils/sidebar/sidebarUtils";

import { toggleGroupState } from "../utils/sidebar/toggleUtils";

interface SidebarProps {
  openTabs: Tab[];
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  collapsed: boolean;
}

const Sidebar = ({ openTabs, setOpenTabs, collapsed }: SidebarProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGroupedInvestigations();
        setItems(data);
        setExpandedGroups(getInitialCollapsedMap(data));
      } catch (err) {
        console.error("Failed to load groups:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => toggleGroupState(prev, groupId));
  };

  const handleInvestigationClick = async (inv: any) => {
    if (tabExists(openTabs, inv.investigation_id)) return;

    try {
      const result = await fetchInvestigationById(inv.investigation_id);
      setOpenTabs((prev) => [
        ...prev,
        {
          id: inv.investigation_id,
          type: "investigation",
          title: inv.name,
          content: result,
        },
      ]);
    } catch (err) {
      console.error("Failed to load investigation:", err);
    }
  };

  const handleGroupClick = (group: any) => {
    if (tabExists(openTabs, group.group_id)) return;

    const children = group.investigations || [];
    setOpenTabs((prev) => [
      ...prev,
      {
        id: group.group_id,
        type: "group",
        title: group.name,
        content: children,
      },
    ]);
  };

  const handleCollapseAll = () => {
    if (items.length === 0) return;
    const collapsedMap = getInitialCollapsedMap(items);
    setExpandedGroups(collapsedMap);
  };

  const handleExpandAll = () => {
    if (items.length === 0) return;
    const expandedMap = Object.fromEntries(
      items.map((g) => [g.group_id, true])
    );
    setExpandedGroups(expandedMap);
  };

  const filteredGroups = filterGroupsWithSearch(items, searchTerm);
  const isExpandDisabled =
    loading ||
    items.length === 0 ||
    Object.values(expandedGroups).every((v) => v === true);
  const isCollapseDisabled =
    loading ||
    items.length === 0 ||
    Object.values(expandedGroups).every((v) => v === false);

  return (
    <aside
      className={`${styles.sidebarContainer} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.sidebarScroll}>
        <div className={styles.sidebarButtonGroup}>
          <button
            className={styles.sidebarButton}
            onClick={handleExpandAll}
            disabled={isExpandDisabled}
          >
            Expand All
          </button>

          <button
            className={styles.sidebarButton}
            onClick={handleCollapseAll}
            disabled={isCollapseDisabled}
          >
            Collapse All
          </button>
        </div>

        <div className={styles.sidebarSearchGroup}>
          <input
            type="text"
            placeholder="Search groups or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.sidebarSearchInput}
          />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          filteredGroups.map((group) => (
            <div key={group.group_id} className={styles.sidebarGroup}>
              <div className={styles.sidebarGroupHeader}>
                <span
                  className={styles.sidebarArrow}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.group_id);
                  }}
                >
                  {expandedGroups[group.group_id] ? "▼" : "►"}
                </span>
                <span
                  className={styles.sidebarGroupTitle}
                  onClick={() => handleGroupClick(group)}
                >
                  {group.name}
                </span>
              </div>

              {expandedGroups[group.group_id] && (
                <div className={styles.sidebarGroupItems}>
                  {group.investigations?.length > 0 ? (
                    group.investigations.map((inv: any) => (
                      <div
                        key={inv.investigation_id}
                        className={styles.sidebarItem}
                        onClick={() => handleInvestigationClick(inv)}
                      >
                        {inv.name}
                      </div>
                    ))
                  ) : (
                    <div className={styles.sidebarItemEmpty}>No children</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
