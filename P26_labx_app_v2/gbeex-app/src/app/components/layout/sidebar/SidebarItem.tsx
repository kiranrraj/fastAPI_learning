// components/sidebar/SidebarItem.tsx
import React from "react";

interface SidebarItemProps {
  id: string;
  name: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name }) => {
  return <li className="py-1">{name}</li>;
};

export default React.memo(SidebarItem);
