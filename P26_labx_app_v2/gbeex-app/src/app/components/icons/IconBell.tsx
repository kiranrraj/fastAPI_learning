// src\app\components\icons\IconBell.tsx

import React from "react";

/**
 * Component: BellIcon
 * --------------------
 * SVG-based notification bell icon.
 *
 * Props:
 * - filled: whether to render a filled bell or outline only
 * - size: icon size in pixels (default: 20)
 * - color: icon stroke/fill color (default: inherits current text color)
 *
 * Usage:
 * <BellIcon filled={true} size={24} color="#ff0000" />
 */

interface BellIconProps {
  filled?: boolean;
  size?: number;
  color?: string;
}

const IconBell: React.FC<BellIconProps> = ({
  filled = false,
  size = 20,
  color = "currentColor",
}) => {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color}
        viewBox="0 0 24 24"
      >
        <path d="M12 2a7 7 0 0 0-7 7v4.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 13.586V9a7 7 0 0 0-7-7Zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2a7 7 0 0 0-7 7v4.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 13.586V9a7 7 0 0 0-7-7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconBell;
