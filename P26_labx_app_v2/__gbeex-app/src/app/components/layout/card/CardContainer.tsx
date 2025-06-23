import React, { useState } from "react";
import CardHeader from "./CardHeader";
import CardContent from "./CardContent";
import CardFooter from "./CardFooter";

interface CardContainerProps {
  title: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  onCollapse?: () => void;
  onShare?: () => void;
  onLink?: () => void;
  collapsed?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "default" | "compact";
}

const CardContainer: React.FC<CardContainerProps> = ({
  title,
  icon,
  onClose,
  onCollapse,
  onShare,
  onLink,
  collapsed = false,
  children,
  footer,
  className = "",
  size = "default",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    onCollapse?.();
  };

  return (
    <div
      className={`border rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden ${
        size === "compact" ? "text-sm" : "text-base"
      } ${className}`}
    >
      <CardHeader
        title={title}
        icon={icon}
        onClose={onClose}
        onCollapse={onCollapse}
        onShare={onShare}
        onLink={onLink}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      {!isCollapsed && <CardContent>{children}</CardContent>}
      {!isCollapsed && footer && <CardFooter>{footer}</CardFooter>}
    </div>
  );
};

export default React.memo(CardContainer);
