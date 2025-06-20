"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = async () => {
    setLoading(true);
    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/main", // or wherever you want to send them post-login
    });
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "4rem auto", textAlign: "center" }}
    >
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>Login failed: {error}</p>}

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          margin: "1rem 0",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "0.5rem 1rem" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
