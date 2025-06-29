import { LogOut } from "lucide-react";
import styles from "./Logout.module.css";

const Logout = () => {
  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <button className={styles.iconButton} onClick={handleLogout}>
      <LogOut size={20} />
    </button>
  );
};

export default Logout;
