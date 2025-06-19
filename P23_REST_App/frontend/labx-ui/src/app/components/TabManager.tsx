"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { Tab } from "../types/tabTypes";
import { fetchGroupedInvestigations } from "../../services/api";

interface TabManagerProps {
  collapsed: boolean;
}

const TabManager = ({ collapsed }: TabManagerProps) => {
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  // Load investigation groups
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGroupedInvestigations();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch investigations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Add default dashboard tab on initial load
  useEffect(() => {
    if (
      !loading &&
      items.length > 0 &&
      openTabs.length === 0 &&
      !hasInitialized.current
    ) {
      hasInitialized.current = true;
      setOpenTabs([
        {
          id: "__default__",
          type: "dashboard",
          title: "All Investigations",
          content: items,
        },
      ]);
    }
  }, [loading, items, openTabs]);

  return (
    <>
      <Sidebar
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
        collapsed={collapsed}
      />
      <MainContent openTabs={openTabs} setOpenTabs={setOpenTabs} />
    </>
  );
};

export default TabManager;
