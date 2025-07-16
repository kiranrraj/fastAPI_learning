"use client";

import { ChevronRight } from "lucide-react";

type Props = {
  isLeaf: boolean;
  isExpanded: boolean;
  onClick: () => void;
};

export default function ExpandCollapseToggle({
  isLeaf,
  isExpanded,
  onClick,
}: Props) {
  if (isLeaf) return <span style={{ width: "16px" }} />;

  return (
    <ChevronRight
      size={16}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
    />
  );
}
