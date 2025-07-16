"use client";

import { createContext } from "react";
import { UserData } from "@/app/types/index";

// 1. Define the "shape" of the context's value
export type UserContextType = {
  user: UserData | null;
  handleLogout: () => void;
};

// 2. Create the context with a default value of null
// Components will use this to subscribe to user data
export const UserContext = createContext<UserContextType | null>(null);
