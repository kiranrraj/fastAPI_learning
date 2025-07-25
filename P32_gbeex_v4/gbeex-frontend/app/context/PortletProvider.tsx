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
      content: <HomeView />,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("home");

  console.log("Auth status:", status);
  console.log("Session object:", session);
  console.log("accessToken:", (session as any)?.accessToken);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Get API Base URL

  const fetchPortlets = useCallback(async () => {
    if (status !== "authenticated" || !API_BASE_URL) return; // Ensure API_BASE_URL
    const token = (session as any)?.accessToken as string | undefined;
    if (!token) return;

    try {
      const resp = await fetch(`${API_BASE_URL}/api/v1/portlets`, {
        // Use API_BASE_URL
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        console.error(
          "Failed loading portlets:",
          resp.status,
          errorData.detail || resp.statusText
        );
        // NEW: Throw an error to propagate it to components using this function
        throw new Error(
          errorData.detail ||
            `Failed to fetch portlets (Status: ${resp.status})`
        );
      }
      const data: Portlet[] = await resp.json();
      setPortlets(data);
    } catch (error: any) {
      console.error(
        "Error fetching portlets in PortletProvider:",
        error.message
      );
      // This catch handles network errors or errors from the throw above.
      // It's good to let it silently fail here for portlet fetching,
      // as the UI can react to an empty portlets list.
    }
  }, [status, session, API_BASE_URL]); // Add API_BASE_URL to dependencies

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
    async (p: PortletBase): Promise<Portlet> => {
      // NEW: Add return type Promise<Portlet>
      if (status !== "authenticated" || !API_BASE_URL) {
        // Ensure API_BASE_URL
        throw new Error("Authentication required or API URL not configured."); // Throw early
      }
      const token = (session as any)?.accessToken as string | undefined;
      if (!token) {
        throw new Error("Authentication token is missing."); // Throw early
      }

      try {
        const resp = await fetch(`${API_BASE_URL}/api/v1/portlets`, {
          // Use API_BASE_URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(p),
        });

        if (!resp.ok) {
          // NEW: If response is not OK, read the error message and THROW it.
          const errorData = await resp.json();
          const errorMessage =
            errorData.detail ||
            `Failed to register portlet (Status: ${resp.status})`;
          console.error(
            "Backend error during portlet registration:",
            resp.status,
            errorMessage
          );
          throw new Error(errorMessage); // This is the crucial change
        }

        const created: Portlet = await resp.json();
        setPortlets((prev) => [...prev, created]);
        openTab({
          type: "portlet",
          id: created.id,
          title: created.title,
          data: created,
        });
        return created; // Return the created portlet on success
      } catch (error: any) {
        // This catch block handles network errors or errors thrown from `if (!resp.ok)` block
        console.error(
          "Network or unexpected error during portlet registration:",
          error.message
        );
        throw error; // Re-throw the error so `handleSubmit` can catch it
      }
    },
    [status, session, openTab, API_BASE_URL] // Add API_BASE_URL to dependencies
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
