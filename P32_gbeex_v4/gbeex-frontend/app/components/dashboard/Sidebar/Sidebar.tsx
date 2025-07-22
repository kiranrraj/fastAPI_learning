// app/components/dashboard/Sidebar/Sidebar.tsx
"use client";

import { useContext } from "react";
import { PortletContext } from "@/app/context/PortletContext";
import { PlusSquare } from "lucide-react";
import styles from "./Sidebar.module.css";
import PortletRegistrationForm from "@/app/components/dashboard/Portlet/Registration/PortletRegistrationForm";
import type { Portlet } from "@/app/types/portlet";
import type { Tab } from "@/app/types/tab";

export function Sidebar() {
  const { portlets, openTab } = useContext(PortletContext);

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.portletList}>
        {portlets.map((p) => (
          <li key={p.id}>
            <button
              className={styles.portletButton}
              onClick={() =>
                openTab({
                  type: "portlet",
                  id: p.id,
                  title: p.title,
                  data: p,
                } as Tab)
              }
            >
              {p.title}
            </button>
          </li>
        ))}
      </ul>

      <button
        className={styles.registerButton}
        onClick={() =>
          openTab({
            type: "custom",
            id: "register-portlet",
            title: "Register Portlet",
            content: <PortletRegistrationForm />,
          } as Tab)
        }
      >
        <PlusSquare size={18} />
        <span>Register Portlet</span>
      </button>
    </aside>
  );
}
