"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export function useLogoutCountdown(
    initialSeconds: number,
    onComplete: () => void
) {
    const [countdown, setCountdown] = useState(initialSeconds);
    const logoutPerformed = useRef(false);

    useEffect(() => {
        // Perform logout once
        if (!logoutPerformed.current) {
            signOut({ redirect: false });
            logoutPerformed.current = true;
        }

        // If countdown reached zero, call onComplete and stop
        if (countdown === 0) {
            onComplete();
            return;
        }

        // Setup recursive timeout for countdown tick
        const timeoutId = setTimeout(() => setCountdown(countdown - 1), 1000);

        // Cleanup timeout on unmount or countdown change
        return () => clearTimeout(timeoutId);
    }, [countdown, onComplete]);

    return countdown;
}
