// src\app\(protected)\gbeex\dashboard\page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/buttons/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/gbeex/auth/login");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {(session.user as any).role}</p>
      <LogoutButton /> {/* Add logout button here */}
    </main>
  );
}
