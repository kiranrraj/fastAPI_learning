// src/app/components/icons/IconExpandAll.tsx
import React from "react";

const IconExpand: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l8 8 8-8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l8 8 8-8" />
  </svg>
);

export default React.memo(IconExpand);
