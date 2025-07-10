"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SignOutPage from "@/app/components/auth/SignOutPage";

export default function SignOutRoute() {
  const router = useRouter();

  const handleReturnToSignIn = () => {
    router.push("/");
  };

  return <SignOutPage onReturnToSignIn={handleReturnToSignIn} />;
}
