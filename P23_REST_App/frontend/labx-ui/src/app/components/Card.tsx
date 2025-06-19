// src/app/components/common/Card.tsx

import styles from "./Card.module.css";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  tId?: string;
  tLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
}

const Card = ({
  title,
  subtitle,
  tId,
  tLabel,
  children,
  footer,
  actions,
}: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.topMeta}>
        {tId && <span className={styles.metaLeft}>T.id: {tId}</span>}
        {tLabel && <span className={styles.metaRight}>{tLabel}</span>}
      </div>

      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <hr className={styles.separator} />

      <div className={styles.body}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
