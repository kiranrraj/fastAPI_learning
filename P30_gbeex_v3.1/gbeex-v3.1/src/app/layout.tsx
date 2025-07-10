import "./globals.css";
import React from "react"; // Import React

export const metadata = {
  title: "Clinical Workspace",
  description: "Secure Health Data Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
