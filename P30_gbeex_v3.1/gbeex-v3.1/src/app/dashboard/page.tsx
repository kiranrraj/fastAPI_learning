"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  User,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  FileText,
  X,
  Home,
  LogOut,
} from "lucide-react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
// Import the new types
import type {
  SidebarItemType,
  TabType,
  HeaderProps,
  TreeItemProps,
} from "@/app/types/dashboard";

// --- Mock Data for Sidebar ---
const sidebarData: SidebarItemType[] = [
  { id: "home", name: "Dashboard", icon: Home, children: [] },
  {
    id: "study-x",
    name: "Study X",
    icon: Folder,
    children: [
      {
        id: "study-x-views",
        name: "Views",
        icon: Folder,
        children: [
          {
            id: "site-performance",
            name: "Site Performance",
            icon: FileText,
            children: [],
          },
          {
            id: "patient-demographics",
            name: "Patient Demographics",
            icon: FileText,
            children: [],
          },
        ],
      },
      { id: "study-x-reports", name: "Reports", icon: FileText, children: [] },
    ],
  },
  {
    id: "study-y",
    name: "Study Y",
    icon: Folder,
    children: [
      {
        id: "study-y-protocol",
        name: "Protocol",
        icon: FileText,
        children: [],
      },
    ],
  },
];

// --- Sub-Components for the Layout ---

const Header = ({ onSignOut }: HeaderProps) => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <Image
        src="/company_logo_resize.png"
        alt="Company Logo"
        width={50}
        height={31}
      />
      <h1 className={styles.headerTitle}>GBeex Knowledge Dashboard</h1>
    </div>
    <div className={styles.headerRight}>
      <button className={styles.iconButton} aria-label="Search">
        <Search size={20} />
      </button>
      <button className={styles.iconButton} aria-label="Notifications">
        <Bell size={20} />
      </button>
      <button
        onClick={onSignOut}
        className={styles.iconButton}
        aria-label="Sign Out"
      >
        <LogOut size={20} />
      </button>
      <div className={styles.userMenu}>
        <User size={20} />
        <span>Admin</span>
      </div>
    </div>
  </header>
);

const TreeItem = ({
  item,
  level,
  onSelectItem,
  openItems,
  setOpenItems,
  isCollapsed,
}: TreeItemProps) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems[item.id];

  const handleToggle = () =>
    setOpenItems((prev: { [key: string]: boolean }) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  const handleSelect = () => {
    if (!hasChildren) onSelectItem(item);
    else handleToggle();
  };

  const Icon = item.icon;

  return (
    <>
      <div onClick={handleSelect} className={styles.treeItem} title={item.name}>
        <span
          style={{ paddingLeft: `${level * 1.5}rem` }}
          className={styles.treeItemContent}
        >
          {hasChildren && (
            <ChevronsRight
              size={16}
              className={`${styles.chevronIcon} ${
                isOpen ? styles.chevronOpen : ""
              }`}
            />
          )}
          <Icon
            size={18}
            className={`${styles.treeIcon} ${
              !hasChildren && !isCollapsed ? styles.treeIconNoChildren : ""
            }`}
          />
          {!isCollapsed && (
            <span className={styles.treeItemName}>{item.name}</span>
          )}
        </span>
      </div>
      {!isCollapsed && hasChildren && isOpen && (
        <div className={styles.treeChildren}>
          {item.children.map((child: SidebarItemType) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onSelectItem={onSelectItem}
              openItems={openItems}
              setOpenItems={setOpenItems}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </>
  );
};

// --- Main Dashboard Page Component ---

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openTabs, setOpenTabs] = useState<TabType[]>([
    { id: "home", name: "Dashboard" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>("home");
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    "study-x": true,
    "study-x-views": true,
  });

  const handleSelectItem = (item: SidebarItemType) => {
    if (!openTabs.find((tab) => tab.id === item.id)) {
      // Create a new TabType object from the SidebarItemType
      const newTab: TabType = { id: item.id, name: item.name };
      setOpenTabs([...openTabs, newTab]);
    }
    setActiveTabId(item.id);
  };

  const handleCloseTab = (
    e: React.MouseEvent<HTMLButtonElement>,
    tabIdToClose: string
  ) => {
    e.stopPropagation();
    const tabIndex = openTabs.findIndex((tab) => tab.id === tabIdToClose);
    const newTabs = openTabs.filter((tab) => tab.id !== tabIdToClose);
    setOpenTabs(newTabs);

    if (activeTabId === tabIdToClose) {
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[Math.max(0, tabIndex - 1)].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const handleSignOut = () => {
    router.push("/signout");
  };

  const ActiveComponent = () => {
    if (!activeTabId)
      return (
        <div className={styles.placeholder}>
          No tabs open. Select an item from the sidebar.
        </div>
      );
    const activeTab = openTabs.find((t) => t.id === activeTabId);
    return (
      <div className={styles.portletContent}>
        <h2 className={styles.portletTitle}>{activeTab?.name}</h2>
        <p>
          This is the main content area for the "{activeTab?.name}" portlet.
        </p>
        <p>
          All dynamic components like tables, charts, and forms for this view
          would be rendered here.
        </p>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header onSignOut={handleSignOut} />
      <div className={styles.mainArea}>
        <nav
          className={`${styles.sidebar} ${
            isSidebarCollapsed ? styles.sidebarCollapsed : ""
          }`}
        >
          <div className={styles.sidebarContent}>
            {sidebarData.map((item: SidebarItemType) => (
              <TreeItem
                key={item.id}
                item={item}
                level={0}
                onSelectItem={handleSelectItem}
                openItems={openItems}
                setOpenItems={setOpenItems}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={styles.sidebarToggle}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </nav>
        <main className={styles.contentArea}>
          <div className={styles.tabBar}>
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`${styles.tabItem} ${
                  activeTabId === tab.id ? styles.tabItemActive : ""
                }`}
              >
                <span>{tab.name}</span>
                <button
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className={styles.tabCloseButton}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.activeContent}>
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
