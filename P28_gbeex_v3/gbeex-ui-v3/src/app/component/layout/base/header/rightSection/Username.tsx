import styles from "@/app/component/layout/base/header/rightSection/Username.module.css";
import { useAppShellState } from "@/app/context/AppShellContext";

const Username = () => {
  const { state } = useAppShellState();
  const username = state.userState?.session?.user?.name || "Guest";

  return <span className={styles.username}>{username}</span>;
};

export default Username;
