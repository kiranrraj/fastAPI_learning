// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {
  // If the user is already signed in, send them to the dashboard
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  // Otherwise, send them to the sign‑in page
  redirect("/signin");
}
