// src/app/components/icons/IconFilledStar.tsx

import React from "react";

const IconFilledStar: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#facc15", // amber-400
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.9 8.6L22 9.3L17 14.1L18.4 21.1L12 17.8L5.6 21.1L7 14.1L2 9.3L9.1 8.6L12 2Z" />
  </svg>
);

export default IconFilledStar;
