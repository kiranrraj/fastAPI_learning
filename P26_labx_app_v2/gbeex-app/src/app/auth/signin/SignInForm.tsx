// src/app/auth/signin/SignInForm.tsx
"use client";

import { FormEvent } from "react";
import styles from "./SignInForm.module.css";

interface SignInFormProps {
  csrfToken: string;
  callbackUrl: string;
  error?: string;
  isSubmitting: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function SignInForm({
  csrfToken,
  callbackUrl,
  error,
  isSubmitting,
  showPassword,
  onTogglePassword,
  onSubmit,
}: SignInFormProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subheading}>Sign in to access your dashboard</p>

        {error && (
          <div className={styles.error}>
            {error === "CredentialsSignin"
              ? "Invalid email or password."
              : "Authentication failed. Try again."}
          </div>
        )}

        <form
          method="post"
          action="/api/auth/callback/credentials"
          onSubmit={onSubmit}
          className={styles.form}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input name="callbackUrl" type="hidden" value={callbackUrl} />

          <label className={styles.label} htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label} htmlFor="password">
            Password
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className={styles.toggleBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.footerNote}>© GBeeX Portlet System</div>
      </div>
    </div>
  );
}
