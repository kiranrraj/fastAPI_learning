// src/app/components/icons/IconChevronLeft.tsx
import React from "react";

const IconChevronLeft: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    className={`w-4 h-4 ${className}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export default React.memo(IconChevronLeft);
