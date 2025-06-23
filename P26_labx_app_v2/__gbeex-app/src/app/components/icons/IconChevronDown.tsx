// src/app/components/icons/IconChevronDown.tsx
import React from "react";

const IconChevronDown: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-4 h-4 ${className}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default React.memo(IconChevronDown);
