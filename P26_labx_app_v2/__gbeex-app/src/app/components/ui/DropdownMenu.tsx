"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/DropdownMenu.module.css";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownMenuProps {
  button: React.ReactNode;
  items: DropdownItem[];
  position?: "left" | "right";
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  button,
  items,
  position = "right",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleItemClick = (item: DropdownItem) => {
    item.onClick?.();
    setOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className={`relative inline-block ${styles.dropdown} ${className}`}
    >
      <div onClick={handleToggle} className={styles.trigger}>
        {button}
      </div>

      {open && (
        <div
          className={`absolute mt-2 z-50 min-w-[150px] rounded-md border 
                      bg-white dark:bg-gray-900 shadow-lg 
                      ${position === "left" ? "left-0" : "right-0"} 
                      ${styles.menu}`}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`w-full px-4 py-2 text-sm text-left 
                          text-neutral-800 dark:text-neutral-100
                          hover:bg-gray-100 dark:hover:bg-gray-800
                          ${styles.menuItem} ${item.className || ""}`}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
