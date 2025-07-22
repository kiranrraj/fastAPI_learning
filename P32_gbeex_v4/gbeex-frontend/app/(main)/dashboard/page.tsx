// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import styles from "./dashboard.module.css";
import { PortletProvider } from "@/app/context/PortletProvider";
import { Header } from "@/app/components/dashboard/Header/Header";
import { Sidebar } from "@/app/components/dashboard/Sidebar/Sidebar";
import { ContentArea } from "@/app/components/dashboard/ContentArea/ContentArea";
import { Footer } from "@/app/components/dashboard/Footer/Footer";

export const revalidate = 0;

export default async function DashboardPage() {
  // 1. Check session on the server:
  const session = await getServerSession(authOptions);
  if (!session) {
    // 2. If not signed in, send them to /signin
    redirect("/signin");
  }

  // 3. If they are, render the dashboard layout
  return (
    <PortletProvider>
      <div className={styles.dashboardLayout}>
        <Header />
        <div className={styles.mainSection}>
          <Sidebar />
          <ContentArea />
        </div>
        <Footer />
      </div>
    </PortletProvider>
  );
}
