// src/app/types/common/portlet.types.ts

export type PortletNode = {
    id: string;                  // Unique ID for the portlet (used for tab ID)
    name: string;                // Display name/title
    group_ids: string[];         // IDs of groups this portlet belongs to
    tags?: string[];             // Any tags for filtering
    hidden?: boolean;            // Whether it's hidden in the sidebar
    locked?: boolean;            // Lock from changes
    favorited?: boolean;         // If this is marked as favorite
    type: "item" | "default";    // Type of node, default used for default view cards
};
