"use client";
import React, { useState } from "react";
import SidebarSearch from "./SidebarSearch";
import SidebarButtonGroup from "./SidebarButtonGroup";

type SortOrder = "az" | "za";

const SidebarHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [states, setStates] = useState<{
    sort: SortOrder;
    expanded: boolean;
    favorites: boolean;
  }>({
    sort: "az",
    expanded: true,
    favorites: false,
  });

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        Investigation Groups
      </h2>

      <SidebarSearch
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      <SidebarButtonGroup states={states} setStates={setStates} />
    </div>
  );
};

export default React.memo(SidebarHeader);
