// src/app/types/common/portlet.types.ts

/**
 * Represents a single node in our portlet structure.
 * Each node is either a group or an individual item.
 */
export interface PortletNode {
  id: string;                          // Unique identifier for the node
  name: string;                        // Display name of the portlet
  type: 'group' | 'item' | 'default';  // Node type: group or item [Default for our default view]

  parentIds: string[];                 // List of parent group IDs 
  childIds?: string[];                 // List of child node IDs (for group-type nodes)
  group_ids?: string[];                // Legacy compatibility: group IDs assigned to this node

  tags?: string[];                     // Optional tags for categorization, filtering, or search
  portletType?: string;                // Type of visualization (table, chart, graph, map)
  tagColor?: string;                   // Optional color indicator for UI badge or tag highlight

  readonly?: boolean;                  // Read only or not
  meta?: PortletMeta;                 // Additional metadata for UI, state management, and layout
}

//  Supplementary metadata used for UI needs, Interaction history [timestamps], Layout-related preferences

export interface PortletMeta {
  fav?: boolean;                       // Whether the node is marked as a favorite
  pinned?: boolean;                    // Whether the node is pinned to top or layout
  hidden?: boolean;                    // Whether the node is hidden 

  createdAt?: number;                  // Creation timestamp [epoch time]
  restoredAt?: number;                 // Timestamp when last restored from deleted or hidden state
  lastAccessed?: number;               // Last interaction time 

  position?: number;                   // for manual sorting or ordering
  tabId?: string;                      // If opened in a tab, this field links it to that tab

  custom?: Record<string, any>;        // for future custom settings 
  viewMode?: 'default' | 'compact' | 'table'; // User’s preferred view mode for this node
}
