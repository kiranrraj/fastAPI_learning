"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MainSection.module.css";
import SidebarContainer from "@/app/components/layout/sidebar/SidebarContainer";
import ContentArea from "@/app/components/layout/content/ContentArea";
import useAPICall from "@/app/hooks/useAPICall";
import { transformToPortletNodes } from "@/app/utils/transform/transformToPortletNodes";
import { PortletNode } from "@/app/types/common/portlet.types";
import Spinner from "@/app/components/layout/base/Spinner";
import Footer from "@/app/components/layout/base/Footer";

const MainSection: React.FC = () => {
  const [portletData, setPortletData] = useState<PortletNode[]>([]);
  const [tabs, setTabs] = useState<Record<string, PortletNode>>({});
  const [tabOrder, setTabOrder] = useState<string[]>([]);
  const [closedTabsStack, setClosedTabsStack] = useState<PortletNode[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [lastRefresh, setLastRefresh] = useState<number | undefined>(undefined);
  const [serverStatus, setServerStatus] = useState<
    "online" | "offline" | "unknown"
  >("unknown");
  const [currentTime, setCurrentTime] = useState<string>("");

  const [loadingTimeoutExpired, setLoadingTimeoutExpired] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  const payload = useMemo(
    () => ({
      params: [{ include_children: true, limit: 50, skip: 0 }],
    }),
    []
  );

  const { data, loading, error, refresh } = useAPICall(
    "http://localhost:8000/labx/entity/InvestigationGroup/list",
    payload,
    []
  );

  const defaultTabNode: PortletNode = {
    id: "__default__",
    name: "Dashboard",
    type: "default",
    parentIds: [],
    meta: {
      viewMode: "default",
    },
  };

  // Spinner + message + fallback timeout logic
  useEffect(() => {
    let minSpinnerTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    if (loading) {
      setShowSpinner(true);

      // Fallback after 10s
      timeoutTimer = setTimeout(() => {
        setLoadingTimeoutExpired(true);
      }, 10000);
    } else {
      // If loading finishes before 2s, let timer hide it later
      minSpinnerTimer = setTimeout(() => {
        setShowSpinner(false);
      }, 2000);
      setLoadingTimeoutExpired(false);
    }

    return () => {
      clearTimeout(minSpinnerTimer);
      clearTimeout(timeoutTimer);
    };
  }, [loading]);

  // Update current time every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data) {
      if (Array.isArray(data) && data.length === 0) {
        setServerStatus("offline");
      } else {
        const transformed = transformToPortletNodes(data);
        setPortletData(transformed);

        setTabs((prev) => {
          if (!prev["__default__"]) {
            return { ...prev, ["__default__"]: defaultTabNode };
          }
          return prev;
        });

        setTabOrder((prev) => {
          if (!prev.includes("__default__")) {
            return [...prev, "__default__"];
          }
          return prev;
        });

        setActiveTabId((prev) => prev || "__default__");

        setLastRefresh(Date.now());
        setServerStatus("online");
      }
    } else if (error) {
      setServerStatus("offline");
    }
  }, [data, error]);

  useEffect(() => {
    console.groupCollapsed("[MainSection Debug]");
    console.log("portletData:", portletData);
    console.log("tabs:", tabs);
    console.log("tabOrder:", tabOrder);
    console.log("activeTabId:", activeTabId);
    console.log("serverStatus:", serverStatus);
    console.groupEnd();
  }, [portletData, tabs, tabOrder, activeTabId, serverStatus]);

  const openTab = (node: PortletNode) => {
    setTabs((prev) => {
      if (prev[node.id]) {
        setActiveTabId(node.id);
        return prev;
      }

      const updatedTabs = { ...prev, [node.id]: node };

      if (prev["__default__"]) {
        delete updatedTabs["__default__"];
      }

      return updatedTabs;
    });

    setTabOrder((prev) => {
      const filtered = prev.filter((id) => id !== "__default__");
      return filtered.includes(node.id) ? filtered : [...filtered, node.id];
    });

    setActiveTabId(node.id);
  };

  const closeTab = (tabId: string) => {
    setTabs((prev) => {
      const updated = { ...prev };
      const closedTab = updated[tabId];
      delete updated[tabId];

      if (closedTab) {
        setClosedTabsStack((prev) => [closedTab, ...prev]);
      }

      return updated;
    });

    setTabOrder((prev) => prev.filter((id) => id !== tabId));

    setActiveTabId((prevActive) =>
      prevActive === tabId
        ? tabOrder.filter((id) => id !== tabId).slice(-1)[0] || ""
        : prevActive
    );
  };

  const restoreLastClosedTab = () => {
    if (closedTabsStack.length === 0) return;
    const [lastClosed, ...rest] = closedTabsStack;
    setClosedTabsStack(rest);
    openTab(lastClosed);
  };

  const handleManualRefresh = () => {
    setServerStatus("unknown");
    refresh?.();
  };

  // Spinner & message view before timeout
  if (loading && !loadingTimeoutExpired) {
    return (
      <main className={styles.mainSection}>
        <div className={styles.loadingWrapper} aria-label="Loading content">
          <Spinner />
          {showLoadingMessage && (
            <p className={styles.loadingMessage}>Loading content...</p>
          )}
        </div>
      </main>
    );
  }

  // Error view after timeout or fetch failure
  if (error || loadingTimeoutExpired) {
    return (
      <main className={styles.mainSection}>
        <div className={styles.errorMessage} role="alert">
          Error loading data: {error?.message || "Timeout fetching data"}
          <button onClick={handleManualRefresh} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  // Main layout
  return (
    <>
      <main className={styles.mainSection}>
        <section className={styles.sidebar}>
          <SidebarContainer onItemClick={openTab} />
        </section>

        <ContentArea
          tabs={Object.fromEntries(tabOrder.map((id) => [id, tabs[id]]))}
          activeTabId={activeTabId}
          portletData={portletData}
          onCloseTab={closeTab}
          onTabClick={setActiveTabId}
          onRestoreLastTab={restoreLastClosedTab}
        />
      </main>

      <Footer
        lastRefreshTimestamp={lastRefresh}
        serverStatus={serverStatus}
        currentTime={currentTime}
      />
    </>
  );
};

export default MainSection;
