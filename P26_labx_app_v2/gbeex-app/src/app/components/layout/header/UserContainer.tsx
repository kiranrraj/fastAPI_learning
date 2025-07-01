// src/app/components/layout/header/UserContainer.tsx
import React from "react";
import Image from "next/image";
import styles from "./UserContainer.module.css";

interface UserContainerProps {
  avatarUrl?: string;
  username?: string;
}

const UserContainer: React.FC<UserContainerProps> = ({
  avatarUrl = "/images/avatar.jpg",
  username = "Guest User",
}) => {
  return (
    <div className={styles.container} title="User">
      <Image
        className={styles.avatar}
        src={avatarUrl}
        alt="User Avatar"
        width={36}
        height={36}
      />
      <span className={styles.username}>{username}</span>
    </div>
  );
};

export default UserContainer;
