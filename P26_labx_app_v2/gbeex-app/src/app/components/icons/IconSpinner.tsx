// src/app/components/icons/IconSpinner.tsx
import React from "react";

const IconSpinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 animate-spin ${className}`}
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="currentColor"
      strokeWidth="5"
      opacity="0.2"
    />
    <path
      d="M45 25a20 20 0 0 1-20 20"
      stroke="currentColor"
      strokeWidth="5"
      fill="none"
    />
  </svg>
);

export default React.memo(IconSpinner);
