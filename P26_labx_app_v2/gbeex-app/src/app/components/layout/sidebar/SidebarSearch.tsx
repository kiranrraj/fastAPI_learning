import React from "react";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({
  value,
  onChange,
  onClear,
}) => {
  return (
    <div className="relative w-full mb-2">
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
          className="absolute right-2 top-1.5 text-gray-500 hover:text-black text-sm"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default React.memo(SidebarSearch);
