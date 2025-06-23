// src/app/components/icons/IconChevronUp.tsx
import React from "react";

const IconChevronUp: React.FC<{ className?: string }> = ({
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
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default React.memo(IconChevronUp);
