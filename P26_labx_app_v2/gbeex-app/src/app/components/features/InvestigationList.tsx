import { fetchInvestigationGroups } from "@/app/lib/api/investigations";

const InvestigationList = async () => {
  const groups = await fetchInvestigationGroups();

  return (
    <div>
      {groups.map((group) => (
        <div key={group.id} className="mb-6">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <ul className="pl-4 list-disc">
            {group.investigations.map((inv) => (
              <li key={inv.id}>
                {inv.name} ({inv.unit})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default InvestigationList;
