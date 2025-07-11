import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/ui/Buttons/Button";
import DropDownPanel from "@/app/components/ui/DropDownPanel/DropDownPanel";
import type { User } from "@/app/types/dashboard.types";
import styles from "@/app/components/ui/UserMenu/UserMenu.module.css";

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={styles["user-menu-container"]} ref={dropdownRef}>
      <Button
        variant="ghost"
        className={styles["user-menu-trigger"]}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <img
          src={user.avatarUrl}
          alt="User avatar"
          className={styles["user-menu-avatar"]}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/100x100/E2E8F0/475569?text=A";
          }}
        />
        <span className={styles["user-menu-name"]}>{user.name}</span>
      </Button>

      <DropDownPanel isOpen={isDropdownOpen}>
        <div className={styles["user-menu-dropdown-placeholder"]}>
          <p>User Details</p>
          <p>Change Password</p>
          <p>Sign Out</p>
        </div>
      </DropDownPanel>
    </div>
  );
};

export default UserMenu;
