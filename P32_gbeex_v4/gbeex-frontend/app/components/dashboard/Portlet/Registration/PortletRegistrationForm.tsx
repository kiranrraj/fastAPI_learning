// app/components/dashboard/Portlet/Registration/PortletRegistrationForm.tsx
"use client";

import { useState, FormEvent, useContext } from "react";
import { PortletContext } from "@/app/context/PortletContext";
import type { PortletBase } from "@/app/types/portlet"; // Assuming this path is correct
import styles from "./PortletRegistrationForm.module.css";

export default function PortletRegistrationForm() {
  const { registerPortlet, portlets } = useContext(PortletContext);
  const [payload, setPayload] = useState<PortletBase>({
    key: "",
    title: "",
    category: "",
    description: "",
    enabled: true,
    order: portlets.length, // Keep original logic for order
    settings: {},
  });
  const [settingsText, setSettingsText] = useState<string>("{}");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(""); // 'success', 'error', or ''
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (k: keyof PortletBase, v: any) =>
    setPayload((p) => ({ ...p, [k]: v }));

  const handleSettings = (txt: string) => {
    setSettingsText(txt);
    try {
      handleChange("settings", JSON.parse(txt));
      setMessage(""); // Clear error if JSON becomes valid
    } catch {
      // invalid JSON, show error message
      setMessage("Invalid JSON in settings field.");
      setMessageType("error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setMessageType("");
    setIsLoading(true);

    try {
      // Basic validation for settings JSON before submission
      if (
        messageType === "error" &&
        message === "Invalid JSON in settings field."
      ) {
        // If there's an existing JSON error, prevent submission
        setIsLoading(false);
        return;
      }
      if (payload.settings === null || typeof payload.settings !== "object") {
        // This case should ideally be caught by handleSettings, but as a fallback
        throw new Error("Settings field must be a valid JSON object.");
      }

      await registerPortlet(payload);
      setMessage("Portlet registered successfully!");
      setMessageType("success");
      // reset form
      setPayload((p) => ({
        ...p,
        key: "",
        title: "",
        category: "",
        description: "",
        order: portlets.length + 1, // Keep original logic for order reset
        settings: {},
      }));
      setSettingsText("{}");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setMessage(
        `Registration failed: ${
          error.message || "An unexpected error occurred."
        }`
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {" "}
      {/* Added container div for overall styling */}
      <div className={styles.formWrapper}>
        {" "}
        {/* Added wrapper for card-like appearance */}
        <h2 className={styles.title}>Register a New Portlet</h2>
        <p className={styles.subtitle}>
          Enter the details for the new portlet you want to add.
        </p>
        {message && (
          <div
            className={`${styles.messageBox} ${
              messageType === "success" ? styles.success : styles.error
            }`}
          >
            {message}
          </div>
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Key</label>
            <input
              type="text"
              value={payload.key}
              onChange={(e) => handleChange("key", e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={payload.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <input
              type="text"
              value={payload.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              value={payload.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={payload.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked)}
                className={styles.checkbox}
              />
              Enabled
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Order</label>
            <input
              type="number"
              value={payload.order}
              onChange={(e) =>
                handleChange("order", parseInt(e.target.value, 10) || 0)
              }
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Settings (JSON)</label>
            <textarea
              value={settingsText}
              onChange={(e) => handleSettings(e.target.value)}
              rows={6}
              className={styles.textarea}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={
              isLoading ||
              (messageType === "error" &&
                message === "Invalid JSON in settings field.")
            }
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
