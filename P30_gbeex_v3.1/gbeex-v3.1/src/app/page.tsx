"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SignInPage from "@/app/components/auth/SignInPage";
import { Toast } from "@/app/components/ui/Toast/Toast";

export default function Home() {
  const router = useRouter();
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleSignIn = (role: string) => {
    console.log(`Signed in as ${role}. Redirecting to dashboard...`);
    router.push("/dashboard");
  };

  return (
    <main>
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <SignInPage onSignIn={handleSignIn} addToast={addToast} />
    </main>
  );
}
