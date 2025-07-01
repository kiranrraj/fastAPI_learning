// src\app\components\buttons\LogoutButton.tsx

"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    // Optional: Redirect to logout page for countdown
    signOut({ callbackUrl: "/gbeex/auth/logout" });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: "1rem",
        padding: "0.6rem 1.2rem",
        backgroundColor: "#d9534f",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
