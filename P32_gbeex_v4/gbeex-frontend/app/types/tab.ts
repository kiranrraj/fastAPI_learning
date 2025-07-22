// app/types/tab.ts

import type { Portlet } from "./portlet";
import type { ReactNode } from "react";

/**
 * A “tab” in the dashboard content area can either be:
 * - A real Portlet
 * - A custom UI (like the registration form)
 */
export type Tab =
    | { type: "portlet"; id: string; title: string; data: Portlet }
    | { type: "custom"; id: string; title: string; content?: ReactNode };
