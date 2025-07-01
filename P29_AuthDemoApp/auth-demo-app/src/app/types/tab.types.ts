// src\app\types\tab.types.ts

export type TabStatus = 'normal' | 'limit' | 'excess';

// Represents a tab object in the UI
export interface Tab {
    id: string;
    title: string;             // Title shown in the tab
    content: React.ReactNode; // JSX content to render inside the tab
    isActive?: boolean;       // Whether this tab is selected
    isFavorite?: boolean;     // Whether this tab is favorite
    isLocked?: boolean;       // Whether this tab is locked 
    isDefault?: boolean;      // Whether this is the default tab
    status?: TabStatus;       // color badge/underline
    tags?: string[];          // colored tags or labels
}

// Props for the TabContainer which holds all tab headers and content
export interface TabContainerProps {
    tabs: Tab[];                                 // Array of tabs to render
    onTabSelect: (id: string) => void;           // Called when a tab is selected
    onTabClose: (id: string) => void;            // Called when a tab is closed
    onTabToggleFavorite?: (id: string) => void;  // Called when favorite toggled
    onTabToggleLock?: (id: string) => void;      // Called when lock toggled
    onTabSetDefault?: (id: string) => void;      // Set a tab as default 
    lastClosedTab?: Tab;                         // Optional tab to restore
    onRestoreLastClosed?: () => void;            // Restore last closed tab
}

// Props for rendering a single TabItem 
export interface TabItemProps extends Tab {
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
    onToggleFavorite?: (id: string) => void;
    onToggleLock?: (id: string) => void;
    onSetDefault?: (id: string) => void;
}

// Props for rendering the content of the active tab
export interface TabContentProps {
    activeTab?: Tab;
}
