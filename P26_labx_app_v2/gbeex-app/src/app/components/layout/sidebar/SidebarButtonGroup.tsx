// components/sidebar/SidebarButtonGroup.tsx
"use client";

import React from "react";
import {
  toggleValue,
  cycleValue,
} from "@/app/components/utils/sidebar/handler_toggle";

// Icons
import IconSortAZ from "@/app/components/icons/IconSortAZ";
import IconSortZA from "@/app/components/icons/IconSortZA";
import IconCollapse from "@/app/components/icons/IconCollapse";
import IconExpand from "@/app/components/icons/IconExpand";
import IconStar from "@/app/components/icons/IconStar";
import IconStarFilled from "@/app/components/icons/IconStarFilled";

type SortOrder = "az" | "za";

interface SidebarButtonGroupProps {
  states: {
    sort: SortOrder;
    expanded: boolean;
    favorites: boolean;
  };
  setStates: (next: SidebarButtonGroupProps["states"]) => void;
}

const SidebarButtonGroup: React.FC<SidebarButtonGroupProps> = ({
  states,
  setStates,
}) => {
  const handleToggle = (key: keyof SidebarButtonGroupProps["states"]) => {
    if (key === "sort") {
      setStates(cycleValue(states, key, ["az", "za"]));
    } else {
      setStates(toggleValue(states, key));
    }
    console.log("Before toggle:", key, states[key]);
  };

  return (
    <div className="flex gap-2 mt-2">
      {/* Sort Button */}
      <button
        onClick={() => handleToggle("sort")}
        title="Sort"
        aria-label="Sort"
      >
        {states.sort === "az" ? <IconSortAZ /> : <IconSortZA />}
      </button>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => handleToggle("expanded")}
        title="Expand/Collapse"
        aria-label="Expand/Collapse"
      >
        {states.expanded ? <IconCollapse /> : <IconExpand />}
      </button>

      {/* Favorites Toggle Button */}
      <button
        onClick={() => handleToggle("favorites")}
        title="Favorites"
        aria-label="Favorites"
      >
        {states.favorites ? <IconStarFilled /> : <IconStar />}
      </button>
    </div>
  );
};

export default React.memo(SidebarButtonGroup);
