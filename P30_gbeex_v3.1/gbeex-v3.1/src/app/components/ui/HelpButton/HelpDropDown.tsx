import React from "react";
import styles from "@/app/components/ui/HelpButton/HelpDropDown.module.css";
import DocsIcon from "../../Icons/DocIcon";
import KeyboardIcon from "../../Icons/KeyboardIcon";
import SupportIcon from "../../Icons/SupportIcon";

interface HelpLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HelpLink: React.FC<HelpLinkProps> = ({
  href,
  icon,
  title,
  description,
}) => (
  <a href={href} className={styles["help-link"]}>
    <div className={styles["help-link-icon"]}>{icon}</div>
    <div className={styles["help-link-text"]}>
      <p className={styles["help-link-title"]}>{title}</p>
      <p className={styles["help-link-description"]}>{description}</p>
    </div>
  </a>
);

const HelpDropDown: React.FC = () => {
  return (
    <div className={styles["help-dropdown"]}>
      <HelpLink
        href="#"
        title="Documentation"
        description="Read our guides and API reference."
        icon={<DocsIcon size={20} />}
      />
      <HelpLink
        href="#"
        title="Keyboard Shortcuts"
        description="Boost your productivity."
        icon={<KeyboardIcon size={20} />}
      />
      <HelpLink
        href="#"
        title="Contact Support"
        description="Get help from our team."
        icon={<SupportIcon size={20} />}
      />
    </div>
  );
};

export default HelpDropDown;
