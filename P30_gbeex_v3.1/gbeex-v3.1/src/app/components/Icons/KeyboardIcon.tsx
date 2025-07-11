import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const KeyboardIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 7h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3m-6 0H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 0h6" />
    <path d="M12 12h.01" />
  </svg>
);

export default KeyboardIcon;
