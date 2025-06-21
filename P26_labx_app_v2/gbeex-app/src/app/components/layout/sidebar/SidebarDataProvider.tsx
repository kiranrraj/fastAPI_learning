"use client";

import React, { useState, useCallback } from "react";
import { useSidebarData } from "@/app/components/ui/useSidebarData";
import {
  SidebarGroup,
  Investigation,
  SortOrder,
} from "@/app/types/sidebar.types";
import SidebarList from "./SidebarList";
import SidebarHeader from "./SidebarHeader";
import { filterAndSortGroups } from "@/app/components/utils/sidebar/filter_sort";

const SidebarDataProvider: React.FC = () => {
  const { groups: originalGroups = [], loading, error } = useSidebarData();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");
  const [favorites, setFavorites] = useState<Investigation[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredGroups = filterAndSortGroups(
    originalGroups,
    searchTerm,
    sortOrder
  );

  const toggleFavorite = useCallback(
    (item: Investigation, fromGroupId?: string) => {
      setFavorites((prev) => {
        const exists = prev.find((f) => f.id === item.id);
        return exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
      });
    },
    []
  );

  const expandAll = () => {
    if (filteredGroups.length > 0) {
      const allIds = new Set(filteredGroups.map((g) => g.id));
      setExpandedGroups(allIds);
    }
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <>
      <SidebarHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        expanded={expandedGroups.size > 0}
        setExpanded={(value) => (value ? expandAll() : collapseAll())}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      <SidebarList
        groups={filteredGroups}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        expandedGroups={expandedGroups}
        setExpandedGroups={setExpandedGroups}
      />
    </>
  );
};

export default SidebarDataProvider;
