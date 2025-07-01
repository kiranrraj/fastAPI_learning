"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getCsrfToken } from "next-auth/react";
import SignInForm from "./SignInForm";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/gbeex";

  const [csrfToken, setCsrfToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [showError, setShowError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  useEffect(() => {
    getCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });

    const failCount = parseInt(localStorage.getItem("failCount") || "0");
    const lockoutUntil = parseInt(localStorage.getItem("lockoutUntil") || "0");
    const now = Math.floor(Date.now() / 1000);

    if (lockoutUntil && now < lockoutUntil) {
      setIsLockedOut(true);
      setRemainingTime(lockoutUntil - now);
    } else {
      localStorage.removeItem("lockoutUntil");
      localStorage.removeItem("failCount");
      setAttemptsLeft(MAX_ATTEMPTS);
    }
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (!isLockedOut) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("lockoutUntil");
          localStorage.removeItem("failCount");
          setIsLockedOut(false);
          setAttemptsLeft(MAX_ATTEMPTS);
          setShowError(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const role = form.get("role") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
      callbackUrl,
    });

    if (res?.error) {
      setShowError(true);

      const failCount = parseInt(localStorage.getItem("failCount") || "0") + 1;

      if (failCount >= MAX_ATTEMPTS) {
        const until = Math.floor(Date.now() / 1000) + LOCKOUT_DURATION;
        localStorage.setItem("lockoutUntil", until.toString());
        localStorage.removeItem("failCount");
        setIsLockedOut(true);
        setRemainingTime(LOCKOUT_DURATION);
        setAttemptsLeft(0);
      } else {
        localStorage.setItem("failCount", failCount.toString());
        setAttemptsLeft(MAX_ATTEMPTS - failCount);
      }
    } else {
      // Successful login — clear localStorage and redirect
      localStorage.removeItem("failCount");
      localStorage.removeItem("lockoutUntil");
      setShowError(false);
      router.push(res?.url || callbackUrl);
    }

    setIsSubmitting(false);
  };

  return (
    <SignInForm
      csrfToken={csrfToken}
      callbackUrl={callbackUrl}
      error={showError ? "CredentialsSignin" : undefined}
      isSubmitting={isSubmitting}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onSubmit={handleSubmit}
      isLockedOut={isLockedOut}
      remainingTime={remainingTime}
      attemptsLeft={attemptsLeft}
    />
  );
}
