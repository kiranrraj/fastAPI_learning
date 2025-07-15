import styles from "@/app/dashboard/components/Content.module.css";

export default function Content() {
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentArea}>
        <h2>Welcome to the Dashboard</h2>
        <p>This is your main content area.</p>
      </div>
    </div>
  );
}
