"use client";

import React, { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import Image from "next/image";
import GoogleIcon from "@/app/components/ui/Icons/GoogleIcon";
import GitHubIcon from "@/app/components/ui/Icons/GitHubIcon";
import { Alert } from "@/app/components/ui/Alert/Alert";
import type { SignInPageProps } from "@/app/types/auth";
import styles from "./SignInPage.module.css";

const USER_ROLES = ["Admin", "User", "Doctor", "Analyst"];
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30000;

export default function SignInPage({ onSignIn, addToast }: SignInPageProps) {
  const [role, setRole] = useState(USER_ROLES[0]);
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLockedOut) {
      timer = setInterval(() => {
        setLockoutTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            setIsLockedOut(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut]);

  const handleCredentialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (password === "password") {
      setLoginAttempts(0);
      onSignIn(role);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      const attemptsRemaining = MAX_LOGIN_ATTEMPTS - newAttempts;
      const toastMessage = `Incorrect password. ${
        attemptsRemaining > 0
          ? `${attemptsRemaining} attempts remaining.`
          : "Account will be locked."
      }`;
      addToast(toastMessage);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLockedOut(true);
        setLockoutTimeLeft(LOCKOUT_DURATION_MS);
      }
    }
  };

  const handleGoogleSignIn = () => {
    onSignIn("Sponsor");
  };
  const handleGitHubSignIn = () => {
    onSignIn("Super Admin");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Image
              src="/company_logo_resize.png"
              alt="Company Logo"
              width={100}
              height={62}
              className={styles.headerIcon}
            />
            <h1 className={styles.title}>GBeex Knowledge Dashboard</h1>
            <p className={styles.subtitle}>Sign in to access your dashboard</p>
          </header>

          <div className={styles.socialLoginsContainer}>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLockedOut}
              className="btn btn-secondary w-full"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
            <button
              onClick={handleGitHubSignIn}
              disabled={isLockedOut}
              className="btn btn-secondary w-full"
            >
              <GitHubIcon />
              Sign in with GitHub
            </button>
          </div>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR CONTINUE WITH</span>
            <div className="divider-line"></div>
          </div>

          <form className={styles.form} onSubmit={handleCredentialSubmit}>
            {isLockedOut && (
              <Alert
                type="info"
                message={`Account locked. Please try again in ${Math.ceil(
                  lockoutTimeLeft / 1000
                )}s.`}
              />
            )}

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLockedOut}
                className="form-select"
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                defaultValue="admin@workspace.com"
                disabled={isLockedOut}
                className="form-input"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLockedOut}
                className="form-input"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLockedOut}
              className="btn btn-primary w-full"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
