// src/app/components/icons/IconMoveToTop.tsx
import React from "react";

const IconMoveToTop: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 ${className}`}
  >
    <path d="M12 4L12 20" />
    <path d="M6 10L12 4L18 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default React.memo(IconMoveToTop);
