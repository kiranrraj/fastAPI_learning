// src/app/component/layout/base/header/rightSection/Notification.tsx

import { Bell } from "lucide-react";
import styles from "./Notification.module.css";

const Notification = () => {
  const handleClick = () => {
    alert("Notification clicked");
  };

  return (
    <button className={styles.iconButton} onClick={handleClick}>
      <Bell size={20} />
    </button>
  );
};

export default Notification;
