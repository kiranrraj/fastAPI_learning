// src/app/components/layout/sidebar/SidebarControlGroup.tsx

import React from "react";

const SidebarControlGroup: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`mb-4 space-y-2 ${className}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        [Control group placeholder]
      </p>
      {/* Future: Add search, sort, filter, etc. */}
    </div>
  );
};

export default React.memo(SidebarControlGroup);
