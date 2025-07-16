"use client";
import React, { useState, useMemo } from "react";
import { SidebarContext } from "@/app/contexts/SidebarContext";
import { SidebarView, SortOrder } from "@/app/types/sidebar.types";

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [activeView, setActiveView] = useState<SidebarView>("all");
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set()
  );
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const expandAll = () => {
    // Leave logic to consumer (via setExpandedNodeIds)
  };

  const collapseAll = () => {
    setExpandedNodeIds(new Set());
  };

  const toggleFavorite = (nodeId: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const toggleHidden = (nodeId: string) => {
    setHiddenIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const resetSidebarState = () => {
    setSearchQuery("");
    setExpandedNodeIds(new Set());
    setFavoriteIds(new Set());
    setHiddenIds(new Set());
    setSortOrder("asc");
    setActiveView("all");
  };

  const contextValue = useMemo(
    () => ({
      searchQuery,
      sortOrder,
      activeView,
      expandedNodeIds,
      favoriteIds,
      hiddenIds,
      setSearchQuery,
      toggleSortOrder,
      setActiveView,
      toggleNodeExpansion,
      expandAll,
      collapseAll,
      toggleFavorite,
      toggleHidden,
      resetSidebarState,
      setExpandedNodeIds,
    }),
    [
      searchQuery,
      sortOrder,
      activeView,
      expandedNodeIds,
      favoriteIds,
      hiddenIds,
    ]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};
