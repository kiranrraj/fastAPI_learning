// src\app\components\common\DropDown.tsx

"use client";

import { useState } from "react";
import styles from "./DropDown.module.css";
import type { LucideIcon } from "lucide-react";

export interface DropDownAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  tooltip?: string;
}

interface DropDownProps {
  label?: string;
  actions: DropDownAction[];
}

export default function DropDown({
  label = "Actions",
  actions,
}: DropDownProps) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleAction = (action: DropDownAction) => {
    action.onClick();
    setOpen(false);
  };

  return (
    <div className={styles.dropdownWrapper}>
      <button
        className={styles.dropdownToggle}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Toggle dropdown"
      >
        {label} ▼
      </button>

      {open && (
        <ul className={styles.dropdownMenu}>
          {actions.map((action) => (
            <li key={action.label} title={action.tooltip ?? action.label}>
              <button onClick={() => handleAction(action)}>
                <action.icon size={16} />
                <span>{action.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
