import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome, {session.user?.name || session.user?.email}</h1>
      <p>Role: {session.user?.role}</p>
      <Link href="/signout">
        <button style={{ marginTop: "2rem" }}>Sign out</button>
      </Link>
    </div>
  );
}
