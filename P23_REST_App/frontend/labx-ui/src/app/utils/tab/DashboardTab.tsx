// src/app/components/tabs/DashboardTab.tsx

import Card from "../../components/Card";
import styles from "./DashboardTab.module.css";

const DashboardTab = ({ data }: { data: any[] }) => {
  // Sort groups alphabetically by name (case-insensitive)
  const sortedGroups = [...data].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Investigations</h2>
      <div className={styles.grid}>
        {sortedGroups.map((group) => (
          <Card key={group.group_id} title={group.name}>
            <ul className={styles.itemList}>
              {group.investigations?.map((inv: any) => (
                <li key={inv.investigation_id}>{inv.name}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardTab;
