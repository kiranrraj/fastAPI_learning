// src/app/utils/tabUtils.ts

import { Tab } from '../../types/tabTypes'

/**
 * Checks if a tab with the given ID already exists.
 */
export function tabExists(openTabs: Tab[], id: string): boolean {
  return openTabs.some(tab => tab.id === id)
}
