// src/app/components/icons/IconSearch.tsx
import React from "react";

const IconSearch: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 ${className}`}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="17" y1="17" x2="21" y2="21" />
  </svg>
);

export default React.memo(IconSearch);
