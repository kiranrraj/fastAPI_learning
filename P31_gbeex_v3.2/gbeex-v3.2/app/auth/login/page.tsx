"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import { GitHubIcon } from "@/app/components/icons/GitHubIcon";
import { X, Eye, EyeOff } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const clearUsername = () => setUsername("");
  const clearPassword = () => setPassword("");
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", {
      username,
      password,
      redirect: false,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h1 className={styles.heading}>Welcome to GbeeX</h1>
        <p className={styles.subheading}>
          Please sign in with username and password
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username Field */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
            {username && (
              <X
                className={`${styles.icon} ${styles.clearIcon}`}
                onClick={clearUsername}
              />
            )}
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            {password && (
              <>
                <X
                  className={`${styles.icon} ${styles.clearIcon}`}
                  onClick={clearPassword}
                />
                {showPassword ? (
                  <EyeOff
                    className={`${styles.icon} ${styles.eyeIcon}`}
                    onClick={toggleShowPassword}
                  />
                ) : (
                  <Eye
                    className={`${styles.icon} ${styles.eyeIcon}`}
                    onClick={toggleShowPassword}
                  />
                )}
              </>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>

          <div className={styles.divider}>
            <span className={styles.line} />
            <span className={styles.orText}>or</span>
            <span className={styles.line} />
          </div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => signIn("google")}
            >
              <GoogleIcon /> Sign in with Google
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => signIn("github")}
            >
              <GitHubIcon /> Sign in with GitHub
            </button>
          </div>
        </form>

        <p className={styles.helpText}>
          If you forget username or password, please contact admin at{" "}
          <a href="mailto:admin@gbeex.com">admin@gbeex.com</a>
        </p>

        <footer className={styles.footer}>
          © 2025 GbeeX. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
