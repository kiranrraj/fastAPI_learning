"use client";

import { SessionProvider } from "next-auth/react";
import AppShell from "../../components/layout/base/AppShell";
import SessionGuard from "@/app/components/auth/SessionGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionGuard>
        <AppShell>{children}</AppShell>
      </SessionGuard>
    </SessionProvider>
  );
}
