import styles from "./Header.module.css";
import LeftSection from "@/app/component/layout/base/header/leftSection/LeftSection";
import RightSection from "@/app/component/layout/base/header/rightSection/RightSection";

const Header = () => (
  <header className={styles.header}>
    <LeftSection />
    <RightSection />
  </header>
);

export default Header;
