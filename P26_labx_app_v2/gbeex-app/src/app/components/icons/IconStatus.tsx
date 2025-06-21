// src/app/components/icons/IconStatus.tsx
import React from "react";

interface IconStatusProps {
  isOnline?: boolean;
  className?: string;
}

const IconStatus: React.FC<IconStatusProps> = ({
  isOnline = true,
  className = "",
}) => {
  const fillColor = isOnline ? "#22c55e" : "#ef4444"; // Tailwind green-500 / red-500

  return (
    <svg
      className={`w-3 h-3 ${className}`}
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <circle cx="4" cy="4" r="4" fill={fillColor} />
    </svg>
  );
};

export default React.memo(IconStatus);
