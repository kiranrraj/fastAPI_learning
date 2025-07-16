"use client";

import { useContext } from "react";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import { RotateCcw } from "lucide-react";

export default function ResetButton() {
  const ctx = useContext(SidebarContext);
  if (!ctx) return null;

  return (
    <button
      onClick={ctx.resetSidebarState}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
    >
      <RotateCcw size={14} /> Reset
    </button>
  );
}
