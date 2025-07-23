// app/context/PortletProvider.tsx
"use client";

import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { PortletContext } from "./PortletContext";
import type { Portlet, PortletBase } from "@/app/types/portlet";
import type { Tab } from "@/app/types/tab";

import HomeView from "@/app/components/dashboard/View/HomeView";

interface Props {
  children: ReactNode;
}

export function PortletProvider({ children }: Props) {
  const { data: session, status } = useSession();
  const [portlets, setPortlets] = useState<Portlet[]>([]);

  const [openTabs, setOpenTabs] = useState<Tab[]>([
    {
      type: "custom",
      id: "home",
      title: "Home",
      content: <HomeView />, // use HomeView
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("home");

  console.log("Auth status:", status);
  console.log("Session object:", session);
  console.log("accessToken:", (session as any)?.accessToken);

  const fetchPortlets = useCallback(async () => {
    if (status !== "authenticated") return;
    const token = (session as any)?.accessToken as string | undefined;
    if (!token) return;

    const resp = await fetch("/api/v1/portlets", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!resp.ok) {
      console.error("Failed loading portlets:", resp.status);
      return;
    }
    const data: Portlet[] = await resp.json();
    setPortlets(data);
  }, [status, session]);

  useEffect(() => {
    fetchPortlets();
  }, [fetchPortlets]);

  const openTab = useCallback((tab: Tab) => {
    const id = tab.type === "portlet" ? tab.data.id : tab.id;
    setOpenTabs((prev) =>
      prev.some((t) => (t.type === "portlet" ? t.data.id === id : t.id === id))
        ? prev
        : [...prev, tab]
    );
    setActiveTabId(id);
  }, []);

  const registerPortlet = useCallback(
    async (p: PortletBase) => {
      if (status !== "authenticated") return;
      const token = (session as any)?.accessToken as string | undefined;
      if (!token) return;

      const resp = await fetch("/api/v1/portlets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(p),
      });
      if (!resp.ok) {
        console.error("Failed creating portlet:", resp.status);
        return;
      }
      const created: Portlet = await resp.json();
      setPortlets((prev) => [...prev, created]);
      openTab({
        type: "portlet",
        id: created.id,
        title: created.title,
        data: created,
      });
    },
    [status, session, openTab]
  );

  const closeTab = useCallback(
    (id: string) => {
      setOpenTabs((prev) =>
        prev.filter((t) =>
          t.type === "portlet" ? t.data.id !== id : t.id !== id
        )
      );
      if (activeTabId === id) setActiveTabId("home");
    },
    [activeTabId]
  );

  return (
    <PortletContext.Provider
      value={{
        portlets,
        openTabs,
        activeTabId,
        fetchPortlets,
        openTab,
        closeTab,
        setActiveTabId,
        registerPortlet,
      }}
    >
      {children}
    </PortletContext.Provider>
  );
}
