"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DropdownMenu.module.css";

/**
 * Component: DropdownMenu
 * -----------------------
 * A generic dropdown menu component.
 *
 * INPUTS:
 * - trigger: React node (icon/button/avatar) that opens the menu
 * - children: optional React nodes as custom menu content
 * - items: optional structured array of { label, onClick }
 * - align: left or right alignment
 *
 * OUTPUT:
 * - Renders a dropdown under the trigger
 * - Closes when clicked outside or item clicked
 */

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  items?: { label: string; onClick?: () => void }[];
  align?: "left" | "right";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  items,
  align = "right",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={toggleMenu} className={styles.trigger}>
        {trigger}
      </div>
      {open && (
        <div className={`${styles.menu} ${styles[align]}`}>
          {items && items.length > 0
            ? items.map((item, idx) => (
                <div
                  key={idx}
                  className={styles.menuItem}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                >
                  {item.label}
                </div>
              ))
            : children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
