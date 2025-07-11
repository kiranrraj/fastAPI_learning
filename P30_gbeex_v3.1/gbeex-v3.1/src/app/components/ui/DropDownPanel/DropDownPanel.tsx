import React from "react";
import styles from "@/app/components/ui/DropDownPanel/DropDownPanel.module.css";

interface DropDownPanelProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  originClass?: "origin-top-right" | "origin-top-left" | "origin-bottom-right";
}

const DropDownPanel: React.FC<DropDownPanelProps> = ({
  isOpen,
  children,
  className = "",
  originClass = "origin-top-right",
}) => {
  if (!isOpen) return null;

  const panelClassName = `${styles["dropdown-panel"]} ${
    styles[originClass] || ""
  } ${className}`.trim();

  return (
    <div className={panelClassName} role="menu" aria-orientation="vertical">
      {children}
    </div>
  );
};

export default DropDownPanel;
