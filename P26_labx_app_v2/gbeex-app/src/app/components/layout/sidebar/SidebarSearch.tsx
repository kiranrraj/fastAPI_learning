// components/sidebar/SidebarSearch.tsx
import React from "react";

interface SidebarSearchProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({
  value,
  onChange,
  onClear,
}) => (
  <div className="relative w-full">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="w-full px-3 py-1.5 pr-8 border rounded-md text-sm"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        title="Clear search"
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
  </div>
);

export default React.memo(SidebarSearch);
