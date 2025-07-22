// app/types/portlet.ts

/** The shape of a portlet as stored on the server (minus its ID) */
export interface PortletBase {
    /** Unique machine‑readable key, e.g. "site-performance" */
    key: string;
    /** Human‑readable title, e.g. "Site Performance" */
    title: string;
    /** UI grouping/category, e.g. "Dashboard & Overview Panels" */
    category: string;
    /** Optional description */
    description?: string;
    /** Whether this panel is shown by default */
    enabled: boolean;
    /** Sort order within its category */
    order: number;
    /** Arbitrary settings blob (filters, iframe URL, etc.) */
    settings: Record<string, any>;
}

/** A portlet as returned from the server (with its ID) */
export interface Portlet extends PortletBase {
    /** Mongo/DB-generated ID */
    id: string;
}
