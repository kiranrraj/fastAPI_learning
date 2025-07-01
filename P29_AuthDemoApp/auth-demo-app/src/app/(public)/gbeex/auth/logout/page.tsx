// src\app\(public)\gbeex\auth\logout\page.tsx

"use client";

import { useEffect, useState } from "react";
import { signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<
    "checking" | "signedOut" | "alreadyLoggedOut"
  >("checking");

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        // User is logged in → begin signout flow
        setStatus("signedOut");
        signOut({ redirect: false });

        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              router.push("/gbeex/auth/login");
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        // No session → treat as already logged out
        setStatus("alreadyLoggedOut");
        const timeout = setTimeout(
          () => router.push("/gbeex/auth/login"),
          3000
        );
        return () => clearTimeout(timeout);
      }
    });
  }, [router]);

  const handleManualLogin = () => router.push("/gbeex/auth/login");

  if (status === "checking") return null; // Avoid flicker

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {status === "signedOut" ? (
        <>
          <h2>You have been logged out</h2>
          <p>
            Redirecting to login in <strong>{countdown}</strong> seconds...
          </p>
        </>
      ) : (
        <>
          <h2>You were already logged out</h2>
          <p>Redirecting to login in 3 seconds...</p>
        </>
      )}
      <button onClick={handleManualLogin}>Login Now</button>
    </div>
  );
}
