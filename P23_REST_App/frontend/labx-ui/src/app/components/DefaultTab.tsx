// components/tabs/DefaultTab.tsx
import styles from "./DefaultTab.module.css";

const DefaultTab = ({ data }: { data: any[] }) => {
  return (
    <div className={styles.defaultTabContainer}>
      {data.map((group) => (
        <div key={group.group_id} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{group.name}</h3>
            <button
              className={styles.shareButton}
              onClick={() => navigator.clipboard.writeText(group.name)}
              title="Copy group name"
            >
              🔗 Share
            </button>
          </div>
          <div className={styles.cardBody}>
            {group.investigations?.length > 0 ? (
              <ul>
                {group.investigations.map((inv: any) => (
                  <li key={inv.investigation_id}>{inv.name}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No investigations</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultTab;
