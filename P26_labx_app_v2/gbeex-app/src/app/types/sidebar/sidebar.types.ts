// src/app/types/sidebar/sidebar.types.ts

import { PortletNode } from "../common/portlet.types";

/**
 * Props for individual group item in the sidebar.
 */
export interface SidebarGroupItemProps {
    group: PortletNode;                  // Must be of type 'group'
    isExpanded: boolean;                 // Controls expand/collapse state
    onToggleExpand: () => void;         // Chevron toggle handler
    onGroupClick?: () => void;          // Optional click handler for title
    childCount?: number;                // Optional badge showing child count
    hidden?: boolean;                   // Optional flag to hide group
    tagMatch?: boolean;                 // Optional: tag filter match highlight
    allData?: PortletNode[];
}

/**
 * Props for a child (item) entry under a group.
 */
export interface SidebarChildItemProps {
    item: PortletNode;                  // Must be of type 'item'
    isFavorite: boolean;                // Starred state
    onToggleFavorite: () => void;      // Favorite toggle handler
    onClick?: () => void;              // Open content tab
    hidden?: boolean;                  // Optional hidden flag
    tagMatch?: boolean;                // Optional highlight if tag matched
    searchMatch?: boolean;             // Optional search term match
}

/**
 * Props for the content area that renders all groups and items.
 */
export interface SidebarContentAreaProps {
    data: PortletNode[];               // Flat list of all nodes
    searchTerm?: string;              // Filter by name (optional)
    activeTags?: string[];            // Filter by tags (optional)
    favoritesOnly?: boolean;          // If true, show only favorites
    hiddenIds?: string[];             // List of node ids to hide
    onFavoriteToggle?: (id: string) => void;  // Toggle handler
    onItemClick?: (id: string) => void;       // Open item handler
}

/**
 * Props for sidebar header controls.
 */
export interface SidebarHeaderProps {
    onSearchChange: (term: string) => void;
    onClearSearch: () => void;
    onSortToggle?: () => void;
    onExpandAll?: () => void;
    onCollapseAll?: () => void;
    favoritesOnly?: boolean;
    onToggleFavoritesOnly?: () => void;
}

/**
 * Container-level props for SidebarContainer (optional if internal state).
 */
export interface SidebarContainerProps {
    data: PortletNode[];
}
