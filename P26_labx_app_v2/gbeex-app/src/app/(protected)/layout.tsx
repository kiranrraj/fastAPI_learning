// src/app/(protected)/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import AppShell from "../components/layout/base/AppShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
