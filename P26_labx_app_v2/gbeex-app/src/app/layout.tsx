// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./components/layout/base/AppShell";

/**
 * Root layout for the entire SPA.
 * -------------------------------
 * Wraps all pages inside AppShell and applies global styles.
 *
 * Dark mode is handled manually via class "dark" on <html>.
 * We use suppressHydrationWarning to avoid mismatch between SSR and client theme class.
 */

export const metadata: Metadata = {
  title: "LabX Portlet SPA",
  description: "A plug-and-play portlet management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* AppShell contains Header, MainSection, Footer */}
        <AppShell />
      </body>
    </html>
  );
}
