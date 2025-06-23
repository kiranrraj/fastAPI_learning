// src/app/components/icons/IconSearch.tsx

import React from "react";

interface IconSearchProps {
  size?: number;
  color?: string;
}

const IconSearch: React.FC<IconSearchProps> = ({
  size = 20,
  color = "#6B7280", // Default: Tailwind gray-500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default IconSearch;
