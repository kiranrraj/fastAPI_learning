// src/app/auth/signin/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams?.get("error") || undefined;
  const callbackUrl = searchParams?.get("callbackUrl") || "/gbeex";

  const [csrfToken, setCsrfToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
  };

  return (
    <SignInForm
      csrfToken={csrfToken}
      callbackUrl={callbackUrl}
      error={error}
      isSubmitting={isSubmitting}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onSubmit={handleSubmit}
    />
  );
}
