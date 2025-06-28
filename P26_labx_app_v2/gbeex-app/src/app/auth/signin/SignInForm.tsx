import React, { FormEvent } from "react";
import styles from "./SignInForm.module.css";

interface SignInFormProps {
  csrfToken: string;
  callbackUrl: string;
  error?: string;
  isSubmitting: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLockedOut: boolean;
  remainingTime: number;
}

const SignInForm: React.FC<SignInFormProps> = ({
  csrfToken,
  callbackUrl,
  error,
  isSubmitting,
  showPassword,
  onTogglePassword,
  onSubmit,
  isLockedOut,
  remainingTime,
}) => {
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subheading}>Sign in to access your dashboard</p>

        {error && !isLockedOut && (
          <div className={styles.error}>
            {error === "CredentialsSignin"
              ? "Invalid email or password."
              : "Authentication failed. Try again."}
          </div>
        )}

        {isLockedOut && (
          <div className={styles.error}>
            Too many failed attempts. Please wait {formatTime(remainingTime)}.
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
              disabled={isLockedOut}
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
                disabled={isLockedOut}
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
            disabled={isSubmitting || isLockedOut}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.footerNote}>© GBeeX Portlet System</div>
      </div>
    </div>
  );
};

export default SignInForm;
