// src/app/components/icons/OpentabIcon.tsx

const OpentabIcon = ({ size = 20 }: { size?: number }) => (
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
      d="M12 4h8m0 0v8m0-8L10 14"
    />
  </svg>
);

export default OpentabIcon;
