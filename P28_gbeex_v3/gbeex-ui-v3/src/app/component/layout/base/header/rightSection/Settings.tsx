import { Settings2 } from "lucide-react";
import styles from "./Settings.module.css";

const Settings = () => {
  const handleSettingsClick = () => {
    alert("Settings clicked");
  };

  return (
    <button className={styles.iconButton} onClick={handleSettingsClick}>
      <Settings2 size={20} />
    </button>
  );
};

export default Settings;
