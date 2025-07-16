"use client";

import React, { useState, ReactNode } from "react";
import { UserContext, UserContextType } from "./UserContext";
import { UserData } from "@/app/types";

// This component will provide the user data to its children
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // State for holding the user data
  const [user, setUser] = useState<UserData>({
    name: "Kiran Raj",
    nickname: "Kiran",
    username: "kraj",
    email: "k.raj@company.com",
    role: "Administrator",
    primaryContact: "+91-9876543210",
    location: "Bengaluru, India",
    avatarUrl: "",
  });

  // Function to handle logging out
  const handleLogout = () => {
    alert("Logout action triggered!");
    // In a real app, you would clear the user state:
    // setUser(null);
  };

  // The value that will be available to all consuming components
  const value: UserContextType = {
    user,
    handleLogout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
