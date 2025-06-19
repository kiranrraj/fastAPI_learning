"use client";

import { useEffect, useState } from "react";
import { Tab } from "../types/tabTypes";
import {
  fetchGroupedInvestigations,
  fetchInvestigationById,
} from "../../services/api";
import Spinner from "./Spinner";
import styles from "./Sidebar.module.css";
import { tabExists } from "../utils/sidebar/tabUtils";
import {
  getInitialCollapsedMap,
  filterGroupsWithSearch,
} from "../utils/sidebar/sidebarUtils";

interface SidebarProps {
  openTabs: Tab[];
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  collapsed: boolean;
}

const Sidebar = ({ openTabs, setOpenTabs, collapsed }: SidebarProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch investigation groups when sidebar mounts
  useEffect(() => {
    setLoading(true);
    fetchGroupedInvestigations()
      .then((data) => {
        setItems(data);
        setExpandedGroups(getInitialCollapsedMap(data));
      })
      .catch((err) =>
        console.error("Error fetching grouped investigations:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
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

    const results = group.investigations || [];
    setOpenTabs((prev) => [
      ...prev,
      {
        id: group.group_id,
        type: "group",
        title: group.name,
        content: results,
      },
    ]);
  };

  const filteredGroups = filterGroupsWithSearch(items, searchTerm);

  return (
    <aside
      className={`${styles.sidebarContainer} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.sidebarScroll}>
        {/* Search input */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Search groups or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "6px 8px" }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : (
          filteredGroups.map((group) => (
            <div key={group.group_id} className={styles.sidebarGroup}>
              <div
                className={styles.sidebarGroupHeader}
                onClick={() => handleGroupClick(group)}
                onDoubleClick={() => toggleGroup(group.group_id)}
              >
                <span
                  className={styles.sidebarArrow}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.group_id);
                  }}
                >
                  {expandedGroups[group.group_id] ? "▼" : "►"}
                </span>
                <span className={styles.sidebarGroupTitle}>{group.name}</span>
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
