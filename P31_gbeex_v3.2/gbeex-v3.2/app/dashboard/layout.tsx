// app/dashboard/layout.tsx
import React from "react";
import DashboardLayout from "./DashboardLayout";

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
