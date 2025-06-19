// src/app/types/tabTypes.ts

export interface Tab {
  id: string
  type: 'investigation' | 'group'
  title: string
  content: any
}
