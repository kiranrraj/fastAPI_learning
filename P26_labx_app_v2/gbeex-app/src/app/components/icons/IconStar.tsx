// src/app/components/icons/IconStar.tsx
import React from "react";

const IconStar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={`w-4 h-4 ${className}`}
  >
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.56 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
  </svg>
);

export default React.memo(IconStar);
