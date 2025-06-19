// src/app/components/icons/ShareIcon.tsx

const ShareIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12v1a4 4 0 004 4h1m6-8V4m0 0l-4 4m4-4l4 4M16 12v1a4 4 0 01-4 4h-1"
    />
  </svg>
);

export default ShareIcon;
