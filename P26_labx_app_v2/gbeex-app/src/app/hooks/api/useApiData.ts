import { useEffect, useRef, useState } from "react";
import { InvestigationGroup } from "@/app/types/sidebar.types";

type Status = "idle" | "loading" | "success" | "error";

interface UseSidebarDataResult {
    groups: InvestigationGroup[];
    status: Status;
    error: string | null;
}

const API_URL = "http://localhost:8000/labx/entity/InvestigationGroup/list";
const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;

export function useSidebarData(): UseSidebarDataResult {
    const [groups, setGroups] = useState<InvestigationGroup[]>([]);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const retryCount = useRef(0);

    useEffect(() => {
        let didSucceed = false;

        const fetchGroups = async () => {
            setStatus("loading");
            setError(null);

            while (retryCount.current < MAX_RETRIES && !didSucceed) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

                try {
                    // For spinner testing
                    // await new Promise((res) => setTimeout(res, 1500));

                    const res = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            params: [{ include_children: true, limit: 10, skip: 0 }],
                        }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (!res.ok) throw new Error(`Server error: ${res.status}`);

                    const rawData = await res.json();

                    // ✅ Map `investigations` → `children`
                    const mapped = (rawData || []).map((group: any) => ({
                        ...group,
                        children: group.investigations || [],
                    }));

                    setGroups(mapped);
                    setStatus("success");
                    didSucceed = true;
                    return;
                } catch (err: any) {
                    clearTimeout(timeoutId);
                    retryCount.current += 1;
                    console.error(`Fetch attempt ${retryCount.current} failed`, err);
                }
            }

            if (!didSucceed) {
                setStatus("error");
                setError("Failed to load investigation groups after multiple attempts.");
            }
        };

        fetchGroups();
    }, []);

    return { groups, status, error };
}
