'use client'

import type { Project, ProjectAction } from '../model/types'
import { EmptyInvitedState } from '../project-list/ui/empty-invited-state'
import { ProjectSectionHeader } from '../project-list/ui/project-section-header'
import { ProjectCard } from './project-card'

interface InvitedProjectSectionProps {
  projects: Project[]
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
  onViewAll?: () => void
}

export const InvitedProjectSection = ({
  projects,
  onProjectClick,
  onProjectAction,
  onViewAll,
}: InvitedProjectSectionProps) => {
  // Invited는 최대 4개까지 표시
  const displayedProjects = projects.slice(0, 4)

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-2" style={{ height: '260px' }}>
        <ProjectSectionHeader title="Invited" totalCount={0} />
        <div className="flex flex-1 items-center justify-center">
          <EmptyInvitedState />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2" style={{ height: '260px' }}>
      <ProjectSectionHeader
        title="Invited"
        totalCount={projects.length}
        {...(onViewAll && { onViewAll })}
      />

      <div className="grid grid-cols-2 gap-2">
        {displayedProjects.map(project => (
          <ProjectCard
            key={project.projectId}
            project={project}
            height="115px"
            variant="invited"
            {...(onProjectClick && { onProjectClick })}
            {...(onProjectAction && { onProjectAction })}
          />
        ))}
      </div>
    </div>
  )
}
