// components/sidebar/SidebarArea.tsx
import React from "react";
import SidebarDataProvider from "./SidebarDataProvider";

const SidebarArea: React.FC = () => {
  return (
    <aside className="w-64 p-4 border-r bg-white dark:bg-gray-800">
      <SidebarDataProvider />
    </aside>
  );
};

export default SidebarArea;
