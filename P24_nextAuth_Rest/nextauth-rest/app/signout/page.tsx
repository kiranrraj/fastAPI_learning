"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doSignOut = async () => {
      await signOut({ redirect: false });
      setTimeout(() => {
        router.replace("/signin");
      }, 1000);
    };

    doSignOut();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <p>Signing you out...</p>
    </div>
  );
}
