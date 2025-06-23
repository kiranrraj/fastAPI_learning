import React from "react";

interface CardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onLink?: () => void;
  onShare?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  icon,
  onLink,
  onShare,
  onClose,
  isCollapsed,
  toggleCollapse,
}) => (
  <div className="flex items-center justify-between p-3 border-b bg-gray-50 dark:bg-gray-800">
    <div className="flex items-center gap-2">
      {icon && <span className="text-xl">{icon}</span>}
      <h3 className="font-semibold truncate text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className="flex items-center gap-1">
      {onLink && (
        <button
          onClick={onLink}
          className="px-2 py-1 text-sm hover:underline"
          title="Open Link"
        >
          🔗
        </button>
      )}
      {onShare && (
        <button
          onClick={onShare}
          className="px-2 py-1 text-sm hover:underline"
          title="Share"
        >
          📤
        </button>
      )}
      <button
        onClick={toggleCollapse}
        className="px-2 py-1 text-sm hover:underline"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? "▣" : "—"}
      </button>
      {onClose && (
        <button
          onClick={onClose}
          className="px-2 py-1 text-sm hover:text-red-600"
          title="Close"
        >
          ✕
        </button>
      )}
    </div>
  </div>
);

export default React.memo(CardHeader);
