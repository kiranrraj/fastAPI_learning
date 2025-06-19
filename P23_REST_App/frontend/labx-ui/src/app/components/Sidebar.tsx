// src/app/components/Sidebar/Sidebar.tsx

'use client'

import { useEffect, useState } from 'react'
import { Tab } from '../types/tabTypes'
import {
  fetchGroupedInvestigations,
  fetchInvestigationById,
  fetchInvestigationsByGroup
} from '../../services/api'
import styles from './Sidebar.module.css'

interface SidebarProps {
  openTabs: Tab[]
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>
}

const Sidebar = ({ openTabs, setOpenTabs }: SidebarProps) => {
  const [items, setItems] = useState<any[]>([])
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})

  // Fetch investigation groups (with children)
  useEffect(() => {
    fetchGroupedInvestigations()
      .then((data) => {
        console.log('[Sidebar] Grouped data fetched:', data)

        setItems(data)

        const initialExpanded: { [key: string]: boolean } = {}
        data.forEach((group: any) => {
          initialExpanded[group.group_id] = false
        })
        setExpandedGroups(initialExpanded)
      })
      .catch((err) => console.error('Error fetching grouped investigations:', err))
  }, [])

  // Expand/Collapse group view
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  // Handle investigation click (single tab)
  const handleInvestigationClick = async (inv: any) => {
    const exists = openTabs.find(tab => tab.id === inv.investigation_id)
    if (exists) return

    try {
      const result = await fetchInvestigationById(inv.investigation_id)
      console.log('[Sidebar] Opened investigation tab:', inv.name, result)

      setOpenTabs(prev => [
        ...prev,
        {
          id: inv.investigation_id,
          type: 'investigation',
          title: inv.name,
          content: result,
        }
      ])
    } catch (err) {
      console.error('Failed to load investigation:', err)
    }
  }

  // Handle group name click → open tab for all children
  const handleGroupClick = async (group: any) => {
    const exists = openTabs.find(tab => tab.id === group.group_id)
    if (exists) return

    try {
      console.log('[Sidebar] Group clicked:', group.name)

      // Use pre-fetched children if available
      const results = group.investigations || []

      // const results = await fetchInvestigationsByGroup(group.group_id)

      console.log(`[Sidebar] Opening tab for group "${group.name}" with children:`, results)

      setOpenTabs(prev => [
        ...prev,
        {
          id: group.group_id,
          type: 'group',
          title: group.name,
          content: results,
        }
      ])
    } catch (err) {
      console.error('Failed to load group investigations:', err)
    }
  }

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarScroll}>
        {items.map((group) => (
          <div key={group.group_id} className={styles.sidebarGroup}>
            <div
              className={styles.sidebarGroupHeader}
              onClick={() => handleGroupClick(group)}
              onDoubleClick={() => toggleGroup(group.group_id)}
            >
              <span
                className={styles.sidebarArrow}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleGroup(group.group_id)
                }}
              >
                {expandedGroups[group.group_id] ? '▼' : '►'}
              </span>
              <span className={styles.sidebarGroupTitle}>{group.name}</span>
            </div>

            {expandedGroups[group.group_id] && (
              <div className={styles.sidebarGroupItems}>
                {group.investigations && group.investigations.length > 0 ? (
                  group.investigations.map((inv: any) => (
                    <div
                      key={inv.investigation_id}
                      className={styles.sidebarItem}
                      onClick={() => handleInvestigationClick(inv)}
                    >
                      {inv.name}
                    </div>
                  ))
                ) : (
                  <div className={styles.sidebarItemEmpty}>No children</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
