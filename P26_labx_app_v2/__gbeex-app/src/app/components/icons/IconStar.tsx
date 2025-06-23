// src/app/components/icons/StarIcon.tsx

import React from "react";

/**
 * Props for the StarIcon component.
 */
interface StarIconProps {
  filled?: boolean; // Whether the star is filled (favorited)
  size?: number; // Optional size (width & height in pixels)
  color?: string; // Optional color (default: Tailwind yellow-400)
  className?: string; // Optional additional Tailwind classes
}

/**
 * Renders a filled or outlined star SVG.
 */
const StarIcon: React.FC<StarIconProps> = ({
  filled = false,
  size = 20,
  color = "#facc15",
  className = "",
}) => {
  return filled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
};

export default React.memo(StarIcon);
