import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name || session.user?.email}</h1>
      <p>Role: {session.user?.role}</p>
      <form method="post" action="/api/auth/signout">
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
