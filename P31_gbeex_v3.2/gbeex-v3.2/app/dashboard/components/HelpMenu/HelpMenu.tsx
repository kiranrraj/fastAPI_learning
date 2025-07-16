"use client";

import React, { useContext } from "react";
import { HelpCircle, BookOpen, Info, Send, ExternalLink } from "lucide-react";
import GenericDropdown from "@/app/components/shared/GenericDropdown";
import styles from "./HelpMenu.module.css";
// We'll create a new context for app-wide info like version
import {
  AppInfoContext,
  AppInfoContextType,
} from "@/app/contexts/AppInfoContext";

export default function HelpMenu() {
  const { appVersion, handleContactAdmin } = useContext(
    AppInfoContext
  ) as AppInfoContextType;

  const trigger = (
    <button className={styles.iconButton} aria-label="Help menu">
      <HelpCircle size={20} />
    </button>
  );

  const content = (
    <ul className={styles.menuList}>
      <li>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.menuItem}
        >
          <div className={styles.itemContent}>
            <BookOpen size={18} className={styles.itemIcon} />
            <span>Documentation</span>
          </div>
          <ExternalLink size={16} className={styles.itemChevron} />
        </a>
      </li>
      <li>
        <button className={styles.menuItem} onClick={handleContactAdmin}>
          <div className={styles.itemContent}>
            <Send size={18} className={styles.itemIcon} />
            <span>Contact Admin</span>
          </div>
        </button>
      </li>
      <li className={styles.menuSeparator}></li>
      <li>
        <div className={`${styles.menuItem} ${styles.versionItem}`}>
          <div className={styles.itemContent}>
            <Info size={18} className={styles.itemIcon} />
            <span>Version</span>
          </div>
          <span className={styles.versionText}>{appVersion}</span>
        </div>
      </li>
    </ul>
  );

  return <GenericDropdown trigger={trigger}>{content}</GenericDropdown>;
}
