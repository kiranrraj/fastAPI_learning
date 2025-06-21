"use client";

import React, { useEffect, useState } from "react";
import SidebarDataGroup from "./SidebarDataGroup";
import { useSidebarData } from "@/app/lib/api/useApiData";
import { InvestigationGroup } from "@/app/types/sidebar.types";

const SidebarDataLoader: React.FC = () => {
  const { groups, status, error } = useSidebarData();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "success") {
      console.log("Sidebar groups loaded:", groups);
    }
  }, [status, groups]);

  if (status === "loading" && !timeoutReached)
    return (
      <div className="flex items-center justify-center gap-1 py-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );

  if (status === "loading" && timeoutReached)
    return <p className="text-sm text-red-500">Unable to load data.</p>;

  if (status === "error")
    return <p className="text-sm text-red-500">{error}</p>;

  if (!groups.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No investigation groups found.
      </p>
    );

  return (
    <>
      {groups.map((group: InvestigationGroup) => (
        <SidebarDataGroup key={group.id} group={group} />
      ))}
    </>
  );
};

export default React.memo(SidebarDataLoader);
