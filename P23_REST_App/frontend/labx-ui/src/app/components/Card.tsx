// src/app/components/common/Card.tsx

import styles from "./Card.module.css";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  tId?: string;
  tLabel?: string;
  metaBlock?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  topRight?: ReactNode;
}

const Card = ({
  title,
  subtitle,
  tId,
  tLabel,
  metaBlock,
  children,
  footer,
  actions,
  topRight,
}: CardProps) => {
  return (
    <div className={styles.card}>
      {topRight && <div className={styles.topBar}>{topRight}</div>}

      <div className={styles.topMeta}>
        {tId && <span className={styles.metaLeft}>T.id: {tId}</span>}
        {tLabel && <span className={styles.metaRight}>{tLabel}</span>}
      </div>

      {metaBlock && <div className={styles.metaBlock}>{metaBlock}</div>}

      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <hr className={styles.separator} />

      <div className={styles.body}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
