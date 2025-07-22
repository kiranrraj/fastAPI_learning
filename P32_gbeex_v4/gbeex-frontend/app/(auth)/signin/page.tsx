// app/(auth)/signin/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./signin.module.css";
import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import { GitHubIcon } from "@/app/components/icons/GitHubIcon";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // renamed from email to username
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      redirect: false,
      username, // pass the username field
      password,
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);

    if (res?.error) {
      setErrorMsg("Invalid credentials");
    } else {
      router.push(res?.url || "/dashboard");
    }
  };

  return (
    <main className={styles.signinContainer}>
      <div className={styles.signinCard}>
        <div className={styles.cardContent}>
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            {/* Username Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={styles.formInput}
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isLoading}
              >
                {isLoading ? "Signing In…" : "Sign In"}
              </button>
              <button
                type="reset"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  setUsername("");
                  setPassword("");
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <div className={styles.separator}>
            <div className={styles.line}></div>
            <span>Or continue with</span>
            <div className={styles.line}></div>
          </div>

          <div className={styles.socialLogins}>
            {/* Uncomment once you have OAuth configured */}
            {/*
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSocial}`}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <GoogleIcon className={styles.icon} />
              Google
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSocial} ${styles.btnGithub}`}
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <GitHubIcon className={styles.icon} />
              GitHub
            </button>
            */}
          </div>

          <div className={styles.footer}>
            <p>
              Forgot your password? Contact{" "}
              <Link href="mailto:administrator@example.com">administrator</Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
