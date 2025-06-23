// src/app/components/icons/IconChevronUp.tsx

import React from "react";

interface IconChevronUpProps {
  size?: number;
  color?: string;
}

const IconChevronUp: React.FC<IconChevronUpProps> = ({
  size = 20,
  color = "#6B7280",
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
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default IconChevronUp;
