// src/app/components/icons/IconSortZA.tsx
import React from "react";

const IconSortZA: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={`w-5 h-5 ${className}`}
  >
    <text
      x="4"
      y="20"
      fontSize="18"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      Z
    </text>
    <text
      x="4"
      y="44"
      fontSize="18"
      fill="currentColor"
      fontFamily="sans-serif"
    >
      A
    </text>
    <line
      x1="36"
      y1="16"
      x2="36"
      y2="44"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <polygon points="30,38 36,44 42,38" fill="currentColor" />
  </svg>
);

export default React.memo(IconSortZA);
