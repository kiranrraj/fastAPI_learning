// components/sidebar/SidebarGroup.tsx
import React from "react";
import { Investigation } from "../../../types/sidebar.types";
import SidebarItem from "./SidebarItem";

interface SidebarGroupProps {
  id: string;
  name: string;
  investigations: Investigation[];
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  name,
  investigations,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
        {name}
      </h3>
      <ul className="ml-4 mt-1 list-disc text-sm text-gray-600 dark:text-gray-300">
        {investigations.map((inv) => (
          <SidebarItem key={inv.id} id={inv.id} name={inv.name} />
        ))}
      </ul>
    </div>
  );
};

export default React.memo(SidebarGroup);
