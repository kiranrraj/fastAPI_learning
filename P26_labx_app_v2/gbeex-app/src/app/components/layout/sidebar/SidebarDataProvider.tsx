// components/sidebar/SidebarDataProvider.tsx
"use client";

import React from "react";
import { useSidebarData } from "../../ui/useSidebarData";
import SidebarList from "./SidebarList";

const SidebarDataProvider: React.FC = () => {
  const { groups, loading, error } = useSidebarData();

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return <SidebarList groups={groups} />;
};

export default SidebarDataProvider;
