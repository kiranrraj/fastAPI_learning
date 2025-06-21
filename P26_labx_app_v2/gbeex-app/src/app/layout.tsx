// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/app/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Gbeex App",
  description: "Your real-time dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
