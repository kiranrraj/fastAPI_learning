// src/app/components/layout/header/NotificationModule.tsx
"use client";

import React from "react";
import { Bell } from "lucide-react";
import styles from "./NotificationModule.module.css";

const NotificationModule: React.FC = () => {
  return (
    <div className={styles.notificationWrapper} title="Notifications">
      <button className={styles.notificationButton}>
        <Bell size={20} />
        <span className={styles.dot} />
      </button>
    </div>
  );
};

export default NotificationModule;
