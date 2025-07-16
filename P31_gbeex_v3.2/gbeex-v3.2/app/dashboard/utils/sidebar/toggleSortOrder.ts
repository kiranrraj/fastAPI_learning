// utils/sidebar/toggleSortOrder.ts
import { SortOrder } from "@/app/types/sidebar.types";

export function toggleSortOrder(current: SortOrder): SortOrder {
    return current === "asc" ? "desc" : "asc";
}
