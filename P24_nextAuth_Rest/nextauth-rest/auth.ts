// auth.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function auth() {
  return await getServerSession(authOptions);
}
