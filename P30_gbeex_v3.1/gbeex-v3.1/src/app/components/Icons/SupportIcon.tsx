import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const SupportIcon: React.FC<IconProps> = ({
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
    <path d="M21.93 15a2.05 2.05 0 0 0-1.83-1.25c-2.12.16-3.88.6-5.1 1.25-1.29.69-2.29 1.5-3 2-0.71-0.5-1.71-1.31-3-2-1.22-0.65-2.98-1.09-5.1-1.25A2.05 2.05 0 0 0 2.07 15C3.42 18.44 7.26 21 12 21s8.58-2.56 9.93-6z" />
    <path d="M15.21 6.34A2.05 2.05 0 0 0 13.5 3c-2.12.16-3.88.6-5.1 1.25C7.11 4.94 6.11 5.75 5.4 6.25c0.71 0.5 1.71 1.31 3 2 1.22 0.65 2.98 1.09 5.1 1.25a2.05 2.05 0 0 0 1.71-3.16z" />
  </svg>
);

export default SupportIcon;
