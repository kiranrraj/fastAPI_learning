// components/sidebar/SidebarDataProvider.tsx
"use client";

import React, { useState } from "react";
import { useSidebarData } from "../../ui/useSidebarData";
import {
  filterAndSortGroups,
  SortOrder,
} from "@/app/components/utils/sidebar/filter_sort";
import SidebarList from "./SidebarList";

const SidebarDataProvider: React.FC = () => {
  const { groups: originalGroups, loading, error } = useSidebarData();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  const filteredGroups = filterAndSortGroups(
    originalGroups,
    searchTerm,
    sortOrder
  );

  return (
    <>
      {/* You can pass setSearchTerm/setSortOrder here if needed */}
      <SidebarList groups={filteredGroups} />
    </>
  );
};

export default SidebarDataProvider;
