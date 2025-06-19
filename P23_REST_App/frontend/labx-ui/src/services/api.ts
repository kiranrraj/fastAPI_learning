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

    // ✅ REMOVE the incorrect check for `groupData.data`
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
    throw error;
  }
}
