// src/app/components/tabs/DashboardTab.tsx

import Card from "../../components/Card";
import styles from "./DashboardTab.module.css";

const DashboardTab = ({ data }: { data: any[] }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Investigations</h2>
      <div className={styles.grid}>
        {data.map((group) => (
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

// const DashboardTab = ({ data }: { data: any[] }) => (
//   <div>
//     <h2>All Investigations</h2>
//     {/* Your DefaultTab layout or card grid goes here */}
//     {data.map((group) => (
//       <div key={group.group_id}>
//         <strong>{group.name}</strong>
//         <ul>
//           {group.investigations?.map((inv: any) => (
//             <li key={inv.investigation_id}>{inv.name}</li>
//           ))}
//         </ul>
//       </div>
//     ))}
//   </div>
// );

// export default DashboardTab;
