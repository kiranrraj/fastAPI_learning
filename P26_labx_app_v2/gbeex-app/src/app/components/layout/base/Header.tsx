"use client";

import React from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import HeaderRight from "../header/HeaderRight";
import useIsClient from "@/app/hooks/useIsClient";

/**
 * Component: Header
 * ------------------
 * The top bar of the application layout.
 *
 * INPUT:
 * - None
 *
 * OUTPUT:
 * - Left: Branding/title
 * - Right: All control modules (user, notifications, theme, etc.)
 * - Safe hydration-aware rendering (prevents mismatch)
 */

const Header: React.FC = () => {
  const isClient = useIsClient();

  // Avoid rendering until client has mounted (avoids hydration mismatch)
  if (!isClient) return null;

  return (
    <header className={styles.header}>
      {/* Left Section: App title */}
      <div className={styles.left}>
        <Image
          className={styles.logo}
          src="/images/company_logo.jpg"
          alt="Company logo"
          width={40}
          height={40}
        />
        <h1 className={styles.title}>GbeeX Portlet System</h1>
      </div>

      {/* Right Section: Controls (user, theme toggle, notifications, etc.) */}
      <div className={styles.right}>
        <HeaderRight />
      </div>
    </header>
  );
};

export default Header;
