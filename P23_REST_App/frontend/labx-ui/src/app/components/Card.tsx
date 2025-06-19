// src/app/components/common/Card.tsx

import styles from "./Card.module.css";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

const Card = ({ title, children, actions }: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Card;
