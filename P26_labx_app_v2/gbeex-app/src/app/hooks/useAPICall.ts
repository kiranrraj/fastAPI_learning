import { useEffect, useState, useCallback, useRef } from "react";

const useAPICall = (
    url: string,
    payload: any,
    dependencies: any[] = []
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [refreshIndex, setRefreshIndex] = useState<number>(0);

    const isManualRefresh = useRef(false); // track manual refreshes

    // Trigger manual refresh
    const refresh = useCallback(() => {
        console.log("[MainSection] Manual refresh triggered");
        isManualRefresh.current = true;
        setRefreshIndex((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (isManualRefresh.current) {
                setData(null); // clear only for manual refresh
            }

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
                if (err.name !== "AbortError") {
                    setError(err);
                }
            } finally {
                setLoading(false);
                isManualRefresh.current = false; // reset flag
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url, refreshIndex]); // triggers on mount + manual refresh

    return { data, loading, error, refresh };
};

export default useAPICall;
