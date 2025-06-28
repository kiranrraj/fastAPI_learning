"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import SignInForm from "./SignInForm";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60; // in seconds (5 minutes)

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams?.get("error") || undefined;
  const callbackUrl = searchParams?.get("callbackUrl") || "/gbeex";

  const [csrfToken, setCsrfToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const [isLockedOut, setIsLockedOut] = useState(false);

  // Load lockout state from localStorage
  useEffect(() => {
    const lockout = localStorage.getItem("lockoutUntil");
    const failCount = parseInt(localStorage.getItem("failCount") || "0");

    if (lockout) {
      const until = parseInt(lockout);
      const now = Math.floor(Date.now() / 1000);
      if (now < until) {
        setIsLockedOut(true);
        setRemainingTime(until - now);
      } else {
        localStorage.removeItem("failCount");
        localStorage.removeItem("lockoutUntil");
      }
    }

    if (error === "CredentialsSignin" && !lockout) {
      if (failCount + 1 >= MAX_ATTEMPTS) {
        const until = Math.floor(Date.now() / 1000) + LOCKOUT_DURATION;
        localStorage.setItem("lockoutUntil", until.toString());
        localStorage.removeItem("failCount");
        setIsLockedOut(true);
        setRemainingTime(LOCKOUT_DURATION);
      } else {
        localStorage.setItem("failCount", (failCount + 1).toString());
      }
    }
  }, [error]);

  // Countdown effect
  useEffect(() => {
    if (!isLockedOut) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("lockoutUntil");
          setIsLockedOut(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut]);

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
      isLockedOut={isLockedOut}
      remainingTime={remainingTime}
    />
  );
}
