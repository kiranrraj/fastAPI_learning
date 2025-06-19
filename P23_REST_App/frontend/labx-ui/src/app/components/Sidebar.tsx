'use client'

import { useEffect, useState } from 'react'
import { fetchGroupedInvestigations } from '../../services/api'

const Sidebar = () => {
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

  return (
    <aside className="w-1/5 min-h-screen bg-gray-100 dark:bg-gray-900 border-r px-4 py-6 overflow-y-auto">
      <div className="space-y-4">
        {items.map((group) => (
          <div key={group.group_id} className="border-b pb-2">
            <div
              className="flex items-center cursor-pointer text-gray-900 dark:text-white font-semibold text-base"
              onClick={() => toggleGroup(group.group_id)}
            >
              <span className="mr-2">
                {expandedGroups[group.group_id] ? '▼' : '►'}
              </span>
              {group.name}
            </div>

            {expandedGroups[group.group_id] && (
              <div className="ml-6 mt-2 space-y-1">
                {group.investigations.map((inv: any) => (
                  <div key={inv.investigation_id} className="text-sm text-gray-700 dark:text-gray-300">
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
