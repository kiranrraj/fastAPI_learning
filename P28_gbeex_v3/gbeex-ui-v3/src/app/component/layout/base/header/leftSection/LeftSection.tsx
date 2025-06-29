import styles from "./LeftSection.module.css";
import Logo from "./Logo";
import AppName from "./AppName";

const LeftSection = () => (
  <div className={styles.left}>
    <Logo />
    <AppName />
  </div>
);

export default LeftSection;
