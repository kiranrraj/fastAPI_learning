import type { LucideProps } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

// Defines the structure for a user object
export interface User {
    name: string;
    avatarUrl: string;
}

// Defines the props for the Header component
export interface HeaderProps {
    user: User;
    onSignOut: () => void;
}

// Defines the structure for a single item in your sidebar's navigation tree
export interface SidebarItemType {
    id: string;
    name: string;
    icon: React.ComponentType<LucideProps>;
    children: SidebarItemType[];
}

// Defines the structure for an open tab
export interface TabType {
    id: string;
    name: string;
}

// Defines the props for each TreeItem in the sidebar
export interface TreeItemProps {
    item: SidebarItemType;
    level: number;
    onSelectItem: (item: SidebarItemType) => void;
    openItems: { [key: string]: boolean };
    setOpenItems: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
    isCollapsed: boolean;
}
