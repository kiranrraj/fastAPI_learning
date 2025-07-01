// src/app/components/layout/header/HeaderRight.tsx
"use client";

import React from "react";
import NotificationModule from "./NotificationModule";
import SettingsMenu from "./SettingsMenu";
import ThemeToggle from "./ThemeToggle";
import UserContainer from "./UserContainer";
import LogoutButton from "./LogoutButton";
import styles from "./HeaderRight.module.css";

const HeaderRight: React.FC = () => {
  return (
    <div className={styles.rightArea}>
      <UserContainer username="Kiranraj R." />
      <NotificationModule />
      <SettingsMenu />
      <ThemeToggle />
      <LogoutButton />
    </div>
  );
};

export default HeaderRight;
