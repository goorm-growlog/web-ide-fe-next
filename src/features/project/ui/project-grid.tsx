'use client'

import type { Project, ProjectAction } from '@/entities/project'
import { ProjectCard } from './project-card'

interface ProjectGridProps {
  projects: Project[]
  columns: number
  maxItems?: number
  cardHeight?: string
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
}

export function ProjectGrid({
  projects,
  columns,
  maxItems,
  cardHeight,
  onProjectClick,
  onProjectAction,
}: ProjectGridProps) {
  const displayedProjects = maxItems ? projects.slice(0, maxItems) : projects

  const gridCols =
    {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }[columns] || 'grid-cols-3'

  return (
    <div className={`grid ${gridCols} gap-[18px]`}>
      {displayedProjects.map(project => (
        <ProjectCard
          key={project.projectId}
          project={project}
          {...(cardHeight && { height: cardHeight })}
          {...(onProjectClick && { onProjectClick })}
          {...(onProjectAction && { onProjectAction })}
        />
      ))}
    </div>
  )
}
