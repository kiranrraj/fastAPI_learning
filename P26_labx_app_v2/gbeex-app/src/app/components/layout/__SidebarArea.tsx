"use client";

import React, { useEffect, useState } from "react";

interface Investigation {
  id: string;
  name: string;
}

interface InvestigationGroup {
  id: string;
  name: string;
  investigations: Investigation[];
}

const SidebarArea: React.FC = () => {
  const [groups, setGroups] = useState<InvestigationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log("Fetching investigation groups...");
        const res = await fetch(
          "http://localhost:8000/labx/entity/InvestigationGroup/list",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              params: [{ include_children: true, limit: 10, skip: 0 }],
            }),
          }
        );

        const data = await res.json();
        console.log("Fetched data:", data); // 👈 Log the raw data
        setGroups(data || []);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!groups.length) {
    console.warn("No groups returned from the API");
    return <div>No groups found.</div>;
  }

  return (
    <aside>
      <h2>Investigation Groups</h2>
      {groups.map((group) => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <ul>
            {group.investigations.map((inv) => (
              <li key={inv.id}>{inv.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default SidebarArea;
