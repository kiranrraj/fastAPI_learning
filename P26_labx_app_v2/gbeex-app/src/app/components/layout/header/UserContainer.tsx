// src/app/components/layout/header/UserContainer.tsx

import React from "react";
import Image from "next/image";
import styles from "./UserContainer.module.css";

/**
 * Component: UserContainer
 * ------------------------
 * Displays the user's avatar and name only.
 *
 * INPUTS:
 * - avatarUrl (optional): URL to the user's avatar
 * - username (optional): name to display
 *
 * OUTPUT:
 * - Avatar + username block (no dropdown)
 */

interface UserContainerProps {
  avatarUrl?: string;
  username?: string;
}

const UserContainer: React.FC<UserContainerProps> = ({
  avatarUrl = "/images/avatar.jpg",
  username = "Guest User",
}) => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.avatar}
        src={avatarUrl}
        alt="Picture of the user"
        width={40}
        height={40}
      />
      <span className={styles.username}>{username}</span>
    </div>
  );
};

export default UserContainer;
