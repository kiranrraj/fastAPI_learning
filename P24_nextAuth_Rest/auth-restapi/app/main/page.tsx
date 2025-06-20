import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name || session.user?.email}</h1>
      <form method="post" action="/api/auth/signout">
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
