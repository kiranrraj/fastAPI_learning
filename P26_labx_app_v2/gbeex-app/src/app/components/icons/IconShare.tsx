// src/app/components/icons/IconShare.tsx
import React from "react";

const IconShare: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    className={`w-4 h-4 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12v.01M4 16v.01M4 8v.01M8 12h8M16 12l4 4m0-8l-4 4"
    />
  </svg>
);

export default React.memo(IconShare);
