// src/app/components/Sidebar.tsx

'use client'

import { useEffect, useState } from 'react'
import { Tab } from '../types/tabTypes'
import {
  fetchGroupedInvestigations,
  fetchInvestigationById
} from '../../services/api'
import styles from './Sidebar.module.css'

interface SidebarProps {
  openTabs: Tab[]
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>
  collapsed: boolean
}

const Sidebar = ({ openTabs, setOpenTabs, collapsed }: SidebarProps) => {
  console.log("Collapsed value:", collapsed); 
  const [items, setItems] = useState<any[]>([])
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchGroupedInvestigations()
      .then((data) => {
        setItems(data)
        const initialExpanded: { [key: string]: boolean } = {}
        data.forEach((group: any) => {
          initialExpanded[group.group_id] = false
        })
        setExpandedGroups(initialExpanded)
      })
      .catch((err) => console.error('Error fetching grouped investigations:', err))
  }, [])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const handleInvestigationClick = async (inv: any) => {
    const exists = openTabs.find(tab => tab.id === inv.investigation_id)
    if (exists) return

    try {
      const result = await fetchInvestigationById(inv.investigation_id)
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

  const handleGroupClick = async (group: any) => {
    const exists = openTabs.find(tab => tab.id === group.group_id)
    if (exists) return

    const results = group.investigations || []
    setOpenTabs(prev => [
      ...prev,
      {
        id: group.group_id,
        type: 'group',
        title: group.name,
        content: results,
      }
    ])
  }

  return (
    <aside className={`${styles.sidebarContainer} ${collapsed ? styles.collapsed : ''}`}>
    {/* <aside className={`${styles.sidebarContainer} ${collapsed ? styles.collapsed : ''}`}> */}
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
