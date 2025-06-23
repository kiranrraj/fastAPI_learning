// src/app/types/common/portlet.types.ts

/**
 * Represents a flat node in the portlet structure.
 * Each node is either a group or an individual item.
 * This unified structure powers the sidebar, content area, and tabs.
 */
export interface PortletNode {
  id: string;                          // Unique identifier for this node
  name: string;                        // Display name (title) for UI
  type: 'group' | 'item';              // Determines if it's a parent group or child item

  parentIds: string[];                 // List of parent group IDs (can support nesting)
  childIds?: string[];                 // Only for groups: IDs of child items or subgroups

  tags?: string[];                     // Optional: categorization tags (e.g., ["biology", "map"])
  portletType?: string;                // Optional: visualization type (e.g., "table", "graph")

  readonly?: boolean;                  // Optional: non-editable or locked portlet
  meta?: PortletMeta;                  // UI, tab, and interaction metadata
}

/**
 * Optional metadata for UI, tab management, and user preferences.
 * This data is used for rendering decisions and behavior tracking.
 */
export interface PortletMeta {
  fav?: boolean;                       // Marked as favorite (shows in favorites list)
  pinned?: boolean;                    // Pinned in tabs (won’t be closed on 'close all')
  hidden?: boolean;                    // Hidden from sidebar or views

  createdAt?: number;                  // Timestamp (ms) of creation
  restoredAt?: number;                 // Timestamp of last restore (for "restore last closed")
  lastAccessed?: number;              // Timestamp of most recent user access (for sorting)

  position?: number;                   // Visual or tab position (manual or computed)
  viewMode?: 'default' | 'compact' | 'table'; // View mode for rendering (cards, list, etc.)
  tabId?: string;                      // Associated tab ID if open in a tab

  custom?: Record<string, any>;        // Fully extensible custom metadata
}
