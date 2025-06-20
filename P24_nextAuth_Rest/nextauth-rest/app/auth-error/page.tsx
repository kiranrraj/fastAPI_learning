"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown error";

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Authentication Failed</h1>
      <p style={{ color: "red", marginBottom: "2rem" }}>{error}</p>
      <Link href="/signin">
        <button style={{ padding: "0.5rem 1rem" }}>Return to Login</button>
      </Link>
    </div>
  );
}
