// src/app/components/icons/IconCopyright.tsx
import React from "react";

interface IconCopyrightProps {
  className?: string;
}

const IconCopyright: React.FC<IconCopyrightProps> = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-4 h-4 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5c1.54 0 2.94-.7 3.87-1.8l-1.45-1.35A2.99 2.99 0 0 1 12 15a3 3 0 1 1 0-6c.96 0 1.82.46 2.37 1.18l1.45-1.35A4.978 4.978 0 0 0 12 7z" />
    </svg>
  );
};

export default React.memo(IconCopyright);
