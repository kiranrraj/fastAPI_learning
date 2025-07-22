// app/Providers.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { PortletProvider } from "@/app/context/PortletProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PortletProvider>{children}</PortletProvider>
    </SessionProvider>
  );
}
