// src/app/components/icons/IconCloseButton.tsx

import React from "react";

interface IconCloseButtonProps {
  size?: number;
  color?: string;
}

const IconCloseButton: React.FC<IconCloseButtonProps> = ({
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default IconCloseButton;
