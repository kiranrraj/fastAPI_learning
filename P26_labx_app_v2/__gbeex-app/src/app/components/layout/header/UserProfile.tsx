// src/app/components/layout/header/UserProfile.tsx
import React from "react";
import styles from "@/app/components/styles/header/UserProfile.module.css";

// Type-safe props for user profile block
interface UserProfileProps {
  name?: string;
  initials?: string;
  avatarUrl?: string;
}

const UserProfile = React.memo(
  ({ name = "John Doe", initials = "JD", avatarUrl }: UserProfileProps) => {
    return (
      <div
        className={`flex items-center gap-2 ${styles.userProfile}`}
        data-testid="user-profile"
        aria-label={`Logged in user: ${name}`}
      >
        {/* Profile image or initials fallback */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            className={`w-8 h-8 rounded-full object-cover ${styles.avatar}`}
          />
        ) : (
          <div
            className={`w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${styles.avatar}`}
          >
            {initials}
          </div>
        )}

        {/* Display name with fallback */}
        <span
          className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${styles.userName}`}
        >
          {name}
        </span>
      </div>
    );
  }
);

UserProfile.displayName = "UserProfile";
export default UserProfile;
