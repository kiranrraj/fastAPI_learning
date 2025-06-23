// src/app/components/icons/IconLink.tsx
import React from "react";

const IconLink: React.FC<{ className?: string }> = ({ className = "" }) => (
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
      d="M10 13a5 5 0 007.071 0l1.414-1.414a5 5 0 000-7.071 5 5 0 00-7.071 0L10 5.929m4 4a5 5 0 00-7.071 0l-1.414 1.414a5 5 0 007.071 7.071L14 18.071"
    />
  </svg>
);

export default React.memo(IconLink);
