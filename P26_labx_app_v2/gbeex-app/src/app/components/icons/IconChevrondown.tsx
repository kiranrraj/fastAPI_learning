// src/app/components/icons/IconChevronDown.tsx

import React from "react";

interface IconChevronDownProps {
  size?: number;
  color?: string;
}

const IconChevronDown: React.FC<IconChevronDownProps> = ({
  size = 20,
  color = "#6B7280", // Tailwind gray-500
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default IconChevronDown;
