import { redirect } from "next/navigation";

export default function Home() {
  redirect("/main"); // Always redirect to protected content
}
