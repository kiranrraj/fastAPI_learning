// src/app/services/api.ts

export async function fetchGroupedInvestigations() {
  try {
    const params = [
      {
        include_children: true,
        limit: 10,
        skip: 0,
      }
    ];

    const groupRes = await fetch("http://localhost:8000/labx/entity/InvestigationGroup/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params })
    });

    const groupData = await groupRes.json();
    console.log("Group Response:", groupData);

    if (!Array.isArray(groupData)) {
      console.warn("Unexpected response format:", groupData);
      return [];
    }

    const groupedResult = groupData.map((group: any) => ({
      ...group,
      investigations: group.investigations || []
    }));

    return groupedResult;
  } catch (error) {
    console.error("Error fetching grouped investigations:", error);
    return [];
  }
}

export async function fetchInvestigationById(investigationId: string) {
  try {
    const response = await fetch("http://localhost:8000/labx/entity/Investigation/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        params: [
          {
            filter: { investigation_id: investigationId },
            limit: 1
          }
        ]
      })
    });

    const data = await response.json();
    console.log(`Investigation ${investigationId}:`, data);

    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error fetching investigation by ID:", error);
    return null;
  }
}

export async function fetchInvestigationsByGroup(groupId: string) {
  try {
    const response = await fetch("http://localhost:8000/labx/entity/Investigation/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        params: [
          {
            filter: { group_id: groupId },
            limit: 100
          }
        ]
      })
    });

    const data = await response.json();
    console.log(`Investigations in group ${groupId}:`, data);

    return Array.isArray(data)
      ? data.map((inv: any) => ({
          ...inv,
          results: inv.results || {} // optional nested result key
        }))
      : [];
  } catch (error) {
    console.error("Error fetching investigations by group:", error);
    return [];
  }
}
