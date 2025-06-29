// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { AppShellProvider } from "@/app/context/AppShellContext";

export const metadata: Metadata = {
  title: "GBEEX App",
  description: "GbeeX UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* This ensures all components using useAppShellState are within the provider */}
        <AppShellProvider>{children}</AppShellProvider>
      </body>
    </html>
  );
}
