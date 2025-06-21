// src/app/components/ui/IconSortToggle.tsx
"use client";

import React, { useState } from "react";
import IconSortAZ from "../icons/IconSortAZ";
import IconSortZA from "../icons/IconSortZA";

interface IconSortToggleProps {
  onToggle?: (isAscending: boolean) => void;
  className?: string;
}

const IconSortToggle: React.FC<IconSortToggleProps> = ({
  onToggle,
  className = "",
}) => {
  const [isAscending, setIsAscending] = useState(true);

  const handleClick = () => {
    const newState = !isAscending;
    setIsAscending(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle sort order"
      title={isAscending ? "Sort A → Z" : "Sort Z → A"}
      className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition ${className}`}
    >
      {isAscending ? <IconSortAZ /> : <IconSortZA />}
    </button>
  );
};

export default IconSortToggle;
