// src\app\components\header\Header.tsx

import RightSection from "@/app/components/header/RightSection";
import { Notification } from "@/app/types/notification.types";

const mockNotifications: Notification[] = [
  { id: "1", message: "Welcome!", read: false },
  { id: "2", message: "System update available", read: true },
];

export default function Header() {
  return (
    <header>
      <RightSection
        userName="John Doe"
        avatarUrl="/default-avatar.png"
        isAdmin={true}
        onLogout={() => console.log("Logout")}
        onToggleTheme={(dark) => console.log("Theme toggled", dark)}
        onProfile={() => console.log("Profile")}
        onSettings={() => console.log("Settings")}
        onAbout={() => console.log("About")}
        onAdminPanel={() => console.log("Admin Panel")}
        onClearFavorites={() => console.log("Clear Favorites")}
        onClearLocked={() => console.log("Clear Locked")}
        onClearHidden={() => console.log("Clear Hidden")}
        onResetToDefault={() => console.log("Reset to Default")}
        notifications={mockNotifications}
      />
    </header>
  );
}
