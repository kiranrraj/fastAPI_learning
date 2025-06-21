// components/sidebar/useSidebarData.ts
import { useEffect, useState } from "react";
import { InvestigationGroup } from "../../types/sidebar.types";

export function useSidebarData() {
    const [groups, setGroups] = useState<InvestigationGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch("http://localhost:8000/labx/entity/InvestigationGroup/list", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        params: [{ include_children: true, limit: 10, skip: 0 }],
                    }),
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setGroups(data || []);
            } catch (err: any) {
                console.error("Sidebar data fetch failed:", err);
                setError("Failed to load investigation groups.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    return { groups, loading, error };
}
