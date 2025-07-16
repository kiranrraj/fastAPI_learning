"use client";

import { ArrowUpDown } from "lucide-react";

export default function SortIconAnimated({ asc }: { asc: boolean }) {
  return (
    <ArrowUpDown
      size={16}
      style={{
        transform: asc ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    />
  );
}
