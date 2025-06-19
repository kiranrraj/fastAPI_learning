"use client";

import { useEffect, useState } from "react";
import { Tab } from "../types/tabTypes";
import {
  fetchGroupedInvestigations,
  fetchInvestigationById,
} from "../../services/api";
import Spinner from "./Spinner";
import styles from "./Sidebar.module.css";

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
  const [loading, setLoading] = useState(true);

  // Fetch grouped investigations when the sidebar mounts
  useEffect(() => {
    setLoading(true);
    fetchGroupedInvestigations()
      .then((data) => {
        setItems(data);

        // Initially collapse all groups
        const initialExpanded: { [key: string]: boolean } = {};
        data.forEach((group: any) => {
          initialExpanded[group.group_id] = false;
        });
        setExpandedGroups(initialExpanded);
      })
      .catch((err) =>
        console.error("Error fetching grouped investigations:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  // Toggle the expand/collapse state of a group
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Open a tab for a single investigation
  const handleInvestigationClick = async (inv: any) => {
    const exists = openTabs.find((tab) => tab.id === inv.investigation_id);
    if (exists) return;

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

  // Open a tab for a group and show all its children
  const handleGroupClick = async (group: any) => {
    const exists = openTabs.find((tab) => tab.id === group.group_id);
    if (exists) return;

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

  // Render the sidebar with collapsible groups and items
  return (
    <aside
      className={`${styles.sidebarContainer} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.sidebarScroll}>
        {loading ? (
          // Show spinner while loading investigations
          <Spinner />
        ) : (
          // Loop through each investigation group
          items.map((group) => (
            <div key={group.group_id} className={styles.sidebarGroup}>
              {/* Group header section with click handlers */}
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

              {/* Show investigations if group is expanded */}
              {expandedGroups[group.group_id] && (
                <div className={styles.sidebarGroupItems}>
                  {group.investigations && group.investigations.length > 0 ? (
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
