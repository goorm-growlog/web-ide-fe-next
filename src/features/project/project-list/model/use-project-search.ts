import { useMemo } from 'react'
import type { Project } from '@/entities/project/model/types'

export const useProjectSearch = (projects: Project[], keyword: string) => {
  return useMemo(() => {
    if (!keyword.trim()) return projects
    const lower = keyword.toLowerCase()
    return projects.filter(
      p =>
        p.projectName.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower),
    )
  }, [projects, keyword])
}
