"use client";

import React, { useContext } from "react";
import {
  User as UserIcon,
  LogOut,
  ChevronDown,
  Mail,
  Shield,
  Phone,
  MapPin,
} from "lucide-react";
import { UserContext, UserContextType } from "@/app/contexts/user/UserContext";
import GenericDropdown from "@/app/components/shared/GenericDropdown";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { user, handleLogout } = useContext(UserContext) as UserContextType;

  if (!user) {
    return null; // Don't render if there's no user
  }

  const trigger = (
    <button className={styles.userToggleButton}>
      <div className={styles.userToggleAvatar}>
        <UserIcon size={18} />
      </div>
      <span className={styles.userToggleName}>{user.name}</span>
      <ChevronDown size={16} className={styles.userChevron} />
    </button>
  );

  const content = (
    <div className={styles.userGrid}>
      <div className={styles.userAvatarCell}>
        <div className={styles.mainAvatar}>
          <UserIcon size={40} />
        </div>
      </div>
      <div className={styles.userInfoCell}>
        <div className={styles.detailItem}>
          <div className={styles.detailText}>
            <span className={styles.label}>Nickname</span>
            <span className={styles.value}>{user.nickname}</span>
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailText}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>{user.username}</span>
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailText}>
            <span className={styles.label}>Primary Contact</span>
            <span className={styles.value}>{user.primaryContact}</span>
          </div>
        </div>
      </div>
      <div className={styles.userActionsCell}>
        <div className={styles.detailItem}>
          <div className={styles.detailText}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>{user.role}</span>
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailText}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>
        </div>
        <div className="detailItem">
          <div className="detailText">
            <span className="label">Location</span>
            <span className="value">{user.location}</span>
          </div>
        </div>
      </div>
      <div style={{ gridColumn: "2 / span 2" }}>
        <button onClick={handleLogout} className={styles.userLogoutButton}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <GenericDropdown trigger={trigger} width={420}>
      {content}
    </GenericDropdown>
  );
}
