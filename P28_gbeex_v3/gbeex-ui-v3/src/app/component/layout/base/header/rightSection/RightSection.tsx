import styles from "./RightSection.module.css";
import Avatar from "@/app/component/layout/base/header/rightSection/Avatar";
import Username from "@/app/component/layout/base/header/rightSection/Username";
import Settings from "@/app/component/layout/base/header/rightSection/Settings";
import Logout from "@/app/component/layout/base/header/rightSection/Logout";
import Notification from "@/app/component/layout/base/header/rightSection/Notification";

const RightSection = () => (
  <div className={styles.right}>
    <Avatar />
    <Username />
    <Notification />
    <Settings />
    <Logout />
  </div>
);

export default RightSection;
