// /app/gbeex/page.tsx
import { redirect } from "next/navigation";

export default function GbeeXRedirect() {
  redirect("/auth/signin");
}
