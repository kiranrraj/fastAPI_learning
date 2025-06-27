"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/app/components/layout/base/Spinner";

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}
