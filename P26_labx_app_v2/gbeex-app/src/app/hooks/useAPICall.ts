import { useEffect, useState, useCallback } from "react";

const useAPICall = (
    url: string,
    payload: any,
    dependencies: any[] = []
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [refreshIndex, setRefreshIndex] = useState<number>(0);

    // Function to trigger refresh manually
    const refresh = useCallback(() => {
        // For Testing Only
        console.log("[MainSection] Manual refresh triggered");
        setRefreshIndex((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
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
                setData(result);
            } catch (err: any) {
                if (err.name === "AbortError") {
                    // Request aborted
                } else {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url, JSON.stringify(payload), refreshIndex, ...dependencies]);

    return { data, loading, error, refresh };
};

export default useAPICall;
