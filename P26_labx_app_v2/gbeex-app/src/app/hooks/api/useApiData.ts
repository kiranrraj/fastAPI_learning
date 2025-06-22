import { useEffect, useRef, useState } from "react";
import { PortletGroup } from "@/app/types/sidebar.types";

// Status types for the data fetch lifecycle
type Status = "idle" | "loading" | "success" | "error";

// Return type of the hook
interface UseSidebarDataResult {
    groups: PortletGroup[]; // Fetched portlet groups
    status: Status;         // Current loading status
    error: string | null;   // Error message (if any)
}

// ---- CONFIGURATION ----
const API_URL = "http://localhost:8000/labx/entity/InvestigationGroup/list"; // API endpoint still uses "InvestigationGroup"
const TIMEOUT_MS = 5000;       // Timeout for each fetch attempt
const MAX_RETRIES = 3;         // Retry limit for failed requests

/**
 * Custom React hook to fetch portlet groups for the sidebar.
 * Includes retry mechanism and abort timeout handling.
 * Maps the API structure from "investigations" to local "children" format.
 */
export function useSidebarData(): UseSidebarDataResult {
    // ---- STATE MANAGEMENT ----
    const [groups, setGroups] = useState<PortletGroup[]>([]);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const retryCount = useRef(0); // Tracks how many retries have been made

    useEffect(() => {
        let didSucceed = false; // Flag to track if the fetch eventually succeeded

        // Main fetch logic
        const fetchGroups = async () => {
            setStatus("loading");
            setError(null);

            while (retryCount.current < MAX_RETRIES && !didSucceed) {
                const controller = new AbortController(); // For aborting on timeout
                const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS); // Trigger timeout abort

                try {
                    // ---- TEST LOADING SPINNER ----
                    // This can be used during development to simulate loading
                    // await new Promise((res) => setTimeout(res, 1500)); // ← Your test code, still here and commented

                    // ---- API CALL ----
                    const res = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            params: [{ include_children: true, limit: 10, skip: 0 }],
                        }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId); // Clear timeout if response arrives in time

                    if (!res.ok) throw new Error(`Server error: ${res.status}`);

                    const rawData = await res.json();

                    // ---- TRANSFORMATION ----
                    // Convert raw API structure (investigations → children)
                    const mapped = (rawData || []).map((group: any) => ({
                        ...group,
                        children: group.investigations || [], // Remap `investigations` to `children`
                    }));

                    setGroups(mapped);       // Save to state
                    setStatus("success");    // Update status
                    didSucceed = true;       // Flag success
                    return;
                } catch (err: any) {
                    clearTimeout(timeoutId);  // Always clear timeout on error
                    retryCount.current += 1;  // Increment retry counter
                    console.error(`Fetch attempt ${retryCount.current} failed`, err);
                }
            }

            // After retries, if no success, set error state
            if (!didSucceed) {
                setStatus("error");
                setError("Failed to load portlet groups after multiple attempts.");
            }
        };

        // Run the fetch
        fetchGroups();
    }, []);

    // Return the final result for consumption
    return { groups, status, error };
}
