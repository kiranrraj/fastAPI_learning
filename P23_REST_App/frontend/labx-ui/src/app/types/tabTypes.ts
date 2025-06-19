// src/app/types/tabTypes.ts

export type TabType = 'investigation' | 'group' | 'dashboard';

export interface Tab {
  id: string;
  type: TabType;
  title: string;
  content: any;
}
