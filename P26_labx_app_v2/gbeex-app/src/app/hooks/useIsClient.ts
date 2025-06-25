// src/app/hooks/useIsClient.ts

// !!!Important
// Avoid hydration mismatch warnings/errors
// Delay rendering of client-only code until mount
// It initializes isClient to false, when React mounts on the client, the useEffect runs and sets isClient to true

import { useEffect, useState } from "react";

export default function useIsClient() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}
