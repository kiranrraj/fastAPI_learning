// app/types/dataExplorer.ts
import { ReactNode } from "react";

export type ViewLevel = "companies" | "protocols" | "sites" | "subjects" | "subjectDetail";

export interface BreadcrumbItem {
    label: string;
    level: ViewLevel;
    id?: string;
}

export interface ColumnDefinition<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    defaultVisible?: boolean;
}

export type SortDirection = 'asc' | 'desc';