// app/layout.tsx
import "./globals.css";
import Providers from "./Providers";
import type { ReactNode } from "react";

export const metadata = {
  title: "GBeeX Dashboard",
  description: "Clinical trials portal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Providers is a client component, so it must be nested here */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
