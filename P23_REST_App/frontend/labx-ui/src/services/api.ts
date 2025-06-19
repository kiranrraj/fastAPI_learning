// src/app/services/api.ts

// URL to our FastAPI end point
const BASE_URL = "http://localhost:8000/labx/entity";
const HEADERS = { "Content-Type": "application/json" };

// Combines BASE_URL + our endpoint
// Sends request to the endpoint with params
// Returns the result
async function postData(endpoint: string, body: any) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return null;
  }
}

// Actual fetching done, on the result, checks the response to make sure it's a list.
// Cleans up the data to make sure every group always has a list of investigations, even if it's empty.
// Returns the result in a format the frontend can render.
// ───────────────────────────────────────────────
export async function fetchGroupedInvestigations(limit = 10, skip = 0) {
  const data = await postData("InvestigationGroup/list", {
    params: [{ include_children: true, limit, skip }],
  });

  if (!Array.isArray(data)) return [];

  return data.map((group: any) => ({
    ...group,
    investigations: group.investigations || [],
  }));
}

//  function fetches the full details of a single investigation — 
// not the group, not the list — just one specific test.
// ───────────────────────────────────────────────
export async function fetchInvestigationById(investigationId: string) {
  const data = await postData("Investigation/list", {
    params: [{ filter: { investigation_id: investigationId }, limit: 1 }],
  });

  return Array.isArray(data) ? data[0] : data;
}
