"use client";

import React, { useEffect, useState, useMemo } from "react";
import SidebarDataGroup from "./SidebarDataGroup";
import { useSidebarData } from "@/app/hooks/api/useApiData";
import { InvestigationGroup } from "@/app/types/sidebar.types";

// Props for sidebar click handlers
interface SidebarDataLoaderProps {
  onGroupClick: (group: InvestigationGroup) => void;
  onItemClick: (item: any) => void; // Replace `any` with specific item type if available
}

const SidebarDataLoader: React.FC<SidebarDataLoaderProps> = ({
  onGroupClick,
  onItemClick,
}) => {
  const { groups, status, error } = useSidebarData();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a timeout so loading doesn’t hang forever
  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  // Memoize rendered group list to prevent unnecessary updates
  const renderedGroups = useMemo(() => {
    return groups.map((group: InvestigationGroup) => (
      <SidebarDataGroup
        key={group.id}
        group={group}
        onGroupClick={onGroupClick}
        onItemClick={onItemClick}
      />
    ));
  }, [groups, onGroupClick, onItemClick]);

  if (status === "loading" && !timeoutReached) {
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
  }

  if (status === "loading" && timeoutReached) {
    return <p className="text-sm text-red-500">Unable to load data.</p>;
  }

  if (status === "error") {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!groups.length) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No investigation groups found.
      </p>
    );
  }

  return <>{renderedGroups}</>;
};

export default React.memo(SidebarDataLoader);
