import React, { FormEvent, useState } from "react";
import styles from "./SignInForm.module.css";
import { Eye, EyeOff } from "lucide-react";

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
  attemptsLeft: number;
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
  attemptsLeft,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleReset = () => {
    setFormData({ email: "", password: "", role: "user" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardHeading}>Welcome Back</h1>
          <p className={styles.cardSubheading}>
            Sign in to access your dashboard
          </p>
        </div>

        {isLockedOut ? (
          <div className={styles.lockoutMessage}>
            Too many failed attempts. Please wait {formatTime(remainingTime)}.
          </div>
        ) : (
          error && (
            <div className={styles.errorMessage}>
              {error === "CredentialsSignin"
                ? `Invalid email or password. ${attemptsLeft} attempt${
                    attemptsLeft === 1 ? "" : "s"
                  } remaining.`
                : "Authentication failed. Try again."}
            </div>
          )
        )}

        <form
          method="post"
          action="#"
          onSubmit={onSubmit}
          className={styles.signInForm}
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {/* Email Field */}
          <label htmlFor="email" className={styles.formLabel}>
            Email
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLockedOut}
            />
          </label>

          {/* Password Field */}
          <label htmlFor="password" className={styles.formLabel}>
            Password
            <div className={styles.passwordField}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={styles.passwordInput}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLockedOut}
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className={styles.passwordToggleBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </label>

          {/* Role Field */}
          <label htmlFor="role" className={styles.formLabel}>
            Role
            <select
              id="role"
              name="role"
              className={styles.formSelect}
              value={formData.role}
              onChange={handleChange}
              disabled={isLockedOut}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {/* Form Buttons */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isLockedOut}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleReset}
              disabled={isLockedOut}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className={styles.infoNote}>
          This portal is restricted to authorized users only. Unauthorized
          access is strictly prohibited.
        </div>

        {/* Optional Footer */}
        <div className={styles.formFooter}>© GBeeX Portal</div>
      </div>
    </div>
  );
};

export default SignInForm;
