// src/app/hooks/useAPICall.ts

import { useEffect, useState } from "react";

/**
 * Hook: useAPICall
 * ----------------
 * A reusable hook to POST data to any API endpoint and retrieve results.
 *
 * INPUT:
 * - url: string - the API endpoint to call (e.g. http://localhost:8000/...)
 * - payload: any - body data to POST (will be stringified)
 * - dependencies: any[] - dependency array to re-trigger the API call
 *
 * OUTPUT:
 * - data: any - response data from the API
 * - loading: boolean - true while the request is in progress
 * - error: any - error object if the request fails
 *
 * Example usage:
 * const { data, loading, error } = useAPICall("/api/endpoint", payload, []);
 */

const useAPICall = (
    url: string,
    payload: any,
    dependencies: any[] = []
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            console.debug("[useAPICall] Fetching from:", url);
            console.debug("[useAPICall] Payload:", payload);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    signal,
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                console.debug("[useAPICall] Response:", result);
                setData(result);
            } catch (err: any) {
                if (err.name === "AbortError") {
                    console.debug("[useAPICall] Request aborted");
                } else {
                    console.error("[useAPICall] Error:", err);
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort(); // cancel if component unmounts or dependencies change
        };
    }, [url, JSON.stringify(payload), ...dependencies]); // hash payload to track changes

    return { data, loading, error };
};

export default useAPICall;
