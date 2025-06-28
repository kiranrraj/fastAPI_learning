// src\app\(protected)\gbeex\layout.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import AppShell from "@/app/components/layout/base/AppShell";
import SessionGuard from "@/app/components/auth/SessionGuard";
import { ToastProvider } from "@/app/components/layout/toast/ToastProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionGuard>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </SessionGuard>
    </SessionProvider>
  );
}
