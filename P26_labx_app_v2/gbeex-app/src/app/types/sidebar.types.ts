// src/app/types/sidebar.types.ts

// Base types
export interface Portlet {
    id: string;
    name: string;
}

export interface PortletGroup {
    id: string;
    name: string;
    children: Portlet[];
}
