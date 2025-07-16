"use client";

import React, { ReactNode } from "react";

import { UserProvider } from "@/app/contexts/user/UserProvider";
import { NotificationProvider } from "@/app/contexts/notification/NotificationProvider";
import { SettingsProvider } from "@/app/contexts/settings/SettingsProvider";
import { CompanyProvider } from "@/app/contexts/company/CompanyProvider";
import { AppInfoProvider } from "@/app/contexts/app/AppInfoProvider";
import { SidebarProvider } from "@/app/contexts/sidebar/SidebarProvider";

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
