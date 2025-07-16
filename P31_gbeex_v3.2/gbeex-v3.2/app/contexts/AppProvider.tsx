"use client";

import React, { ReactNode } from "react";

import { UserProvider } from "@/app/contexts/UserProvider";
import { NotificationProvider } from "@/app/contexts/NotificationProvider";
import { SettingsProvider } from "@/app/contexts/SettingsProvider";
import { CompanyProvider } from "@/app/contexts/CompanyProvider";
import { AppInfoProvider } from "@/app/contexts/AppInfoProvider";
import { SidebarProvider } from "@/app/contexts/SidebarProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppInfoProvider>
      <UserProvider>
        <SettingsProvider>
          <NotificationProvider>
            <CompanyProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </CompanyProvider>
          </NotificationProvider>
        </SettingsProvider>
      </UserProvider>
    </AppInfoProvider>
  );
}
