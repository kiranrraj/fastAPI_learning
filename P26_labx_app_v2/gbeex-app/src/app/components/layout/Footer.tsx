// src/app/components/layout/Footer.tsx
import React from "react";
import IconCopyright from "@/app/components/icons/IconCopyright";
import IconStatus from "@/app/components/icons/IconStatus";
import styles from "@/app/components/styles/Footer.module.css";

interface FooterProps {
  brand?: string;
  status?: "Online" | "Offline";
  year?: number;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  brand = "Gbeex App",
  status = "Online",
  year = new Date().getFullYear(),
  className = "",
}) => {
  return (
    <footer
      className={`flex items-center justify-between px-4 py-2 text-sm border-t bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 ${styles.footer} ${className}`}
      aria-label="Footer"
    >
      <div className="flex items-center gap-1">
        <IconCopyright className="w-4 h-4" />
        <span>
          {year} {brand}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <IconStatus isOnline={status === "Online"} />
        <span
          className={status === "Online" ? "text-green-600" : "text-red-500"}
        >
          {status}
        </span>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
