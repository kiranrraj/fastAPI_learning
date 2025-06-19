// src/app/components/Sidebar/Sidebar.tsx

'use client'

import { useEffect, useState } from 'react'
import { fetchGroupedInvestigations, fetchInvestigationById, fetchInvestigationsByGroup } from '../../services/api'
import { Tab } from '../types/tabTypes'
import styles from './Sidebar.module.css'

interface SidebarProps {
  openTabs: Tab[]
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>
}

const Sidebar = ({ openTabs, setOpenTabs }: SidebarProps) => {
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

    try {
      const results = await fetchInvestigationsByGroup(group.group_id)
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
    <aside className={styles['sidebar-container']}>
      <div className={styles['sidebar-scroll']}>
        {items.map((group) => (
          <div key={group.group_id} className={styles['sidebar-group']}>
            <div
              className={styles['sidebar-group-header']}
              onClick={() => handleGroupClick(group)}
              onDoubleClick={() => toggleGroup(group.group_id)}
            >
              <span onClick={(e) => {
                e.stopPropagation()
                toggleGroup(group.group_id)
              }} className={styles['sidebar-arrow']}>
                {expandedGroups[group.group_id] ? '▼' : '►'}
              </span>
              <span className={styles['sidebar-group-title']}>{group.name}</span>
            </div>

            {expandedGroups[group.group_id] && (
              <div className={styles['sidebar-group-items']}>
                {group.investigations.map((inv: any) => (
                  <div
                    key={inv.investigation_id}
                    className={styles['sidebar-item']}
                    onClick={() => handleInvestigationClick(inv)}
                  >
                    {inv.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
