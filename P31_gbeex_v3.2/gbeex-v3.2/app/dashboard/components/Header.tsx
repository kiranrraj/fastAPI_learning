"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import {
  Menu,
  X,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Settings,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header({ onToggleSidebar, onToggleHeader }: any) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false);

  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signout");
  };

  const closeAllDropdowns = () => {
    setSettingsOpen(false);
    setHelpOpen(false);
    setUserOpen(false);
    setNotifOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !notifRef.current?.contains(target) &&
        !helpRef.current?.contains(target) &&
        !settingsRef.current?.contains(target) &&
        !userRef.current?.contains(target)
      ) {
        closeAllDropdowns();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`${styles.header} ${
        isHeaderCollapsed ? styles.collapsedHeader : ""
      }`}
    >
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={() => {
            setMenuOpen(!isMenuOpen);
            onToggleSidebar();
          }}
          aria-label="Toggle sidebar"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={styles.appName}>
        <span className={styles.appNameG}>G</span>
        <span className={styles.appNameBee}>Bee</span>
        <span className={styles.appNameX}>X</span>
        <span className={styles.appNameSub}>&nbsp;Knowledge Portal</span>
      </div>

      <div className={styles.right}>
        <button
          onClick={() => {
            setHeaderCollapsed(!isHeaderCollapsed);
            onToggleHeader();
          }}
          className={styles.iconBtn}
        >
          {isHeaderCollapsed ? (
            <PanelRightClose size={20} />
          ) : (
            <PanelRightOpen size={20} />
          )}
        </button>

        {/* User Dropdown */}
        <div className={styles.dropdownWrapper} ref={userRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => {
              closeAllDropdowns();
              setUserOpen(!isUserOpen);
            }}
          >
            <User size={20} />
            <span className={styles.userName}>Kiranraj R.</span>
          </button>
          {isUserOpen && (
            <ul className={styles.dropdown}>
              <li>Profile</li>
              <li>My Account</li>
            </ul>
          )}
        </div>

        {/* Notification Dropdown */}
        <div className={styles.dropdownWrapper} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => {
              closeAllDropdowns();
              setNotifOpen(!isNotifOpen);
            }}
          >
            <Bell size={20} />
          </button>
          {isNotifOpen && (
            <ul className={styles.dropdown}>
              <li>No new notifications</li>
              <li>View all</li>
            </ul>
          )}
        </div>

        {/* Help Dropdown */}
        <div className={styles.dropdownWrapper} ref={helpRef}>
          <button
            className={styles.iconBtn}
            onClick={() => {
              closeAllDropdowns();
              setHelpOpen(!isHelpOpen);
            }}
          >
            <HelpCircle size={20} />
          </button>
          {isHelpOpen && (
            <ul className={styles.dropdown}>
              <li>FAQ</li>
              <li>Contact Support</li>
            </ul>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className={styles.dropdownWrapper} ref={settingsRef}>
          <button
            className={styles.iconBtn}
            onClick={() => {
              closeAllDropdowns();
              setSettingsOpen(!isSettingsOpen);
            }}
          >
            <Settings size={20} />
          </button>
          {isSettingsOpen && (
            <ul className={styles.dropdown}>
              <li>Account Settings</li>
              <li>Preferences</li>
            </ul>
          )}
        </div>

        {/* Always visible Logout */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
