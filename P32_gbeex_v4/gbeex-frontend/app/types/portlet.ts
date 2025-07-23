// app/types/portlet.ts

export type PortletCategory = "analytics" | "visualization" | "generic" | "report" | "workflow" | "other";
export type PortletRenderMechanism = "iframe" | "component";

export interface PortletBase {
    key: string;
    title: string;
    category: PortletCategory;
    description: string;
    longDescription?: string;
    enabled: boolean;
    order: number;
    renderMechanism: PortletRenderMechanism;
    url?: string; // Optional, specific to 'iframe'
    componentName?: string; // Optional, specific to 'component'
    isChild: boolean;
    parentPath?: string;
    createdBy: string;
    testNotes?: string;
    settings: Record<string, any>;
}

export interface Portlet extends PortletBase {
    id: string;
}