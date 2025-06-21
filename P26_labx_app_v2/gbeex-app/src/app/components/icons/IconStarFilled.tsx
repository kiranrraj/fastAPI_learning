// components/icons/IconStarCross.tsx
import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const IconStarCross: React.FC<IconProps> = ({
  className = "w-5 h-5",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    style={{ fill: "gray", ...style }}
    aria-hidden="true"
  >
    {/* Star shape */}
    <path d="M12 17.27L18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z" />
    {/* Diagonal slash */}
    <line
      x1="4"
      y1="4"
      x2="20"
      y2="20"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default React.memo(IconStarCross);
