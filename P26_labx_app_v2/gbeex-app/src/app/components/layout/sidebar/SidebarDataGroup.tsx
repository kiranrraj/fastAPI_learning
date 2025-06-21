// src/app/components/layout/sidebar/SidebarDataGroup.tsx

import React from "react";

const SidebarDataGroup: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <p className="text-md font-semibold text-gray-600 dark:text-gray-300">
        [Data group placeholder]
      </p>
      <ul className="ml-4 space-y-1">
        <li className="text-sm text-gray-400 italic">No groups loaded yet.</li>
      </ul>
    </div>
  );
};

export default React.memo(SidebarDataGroup);
