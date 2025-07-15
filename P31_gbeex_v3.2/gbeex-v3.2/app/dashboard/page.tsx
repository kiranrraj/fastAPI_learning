// app/dashboard/page.tsx
import Content from "./components/Content";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.dashboardLayout}>
      <Content />
    </div>
  );
}
