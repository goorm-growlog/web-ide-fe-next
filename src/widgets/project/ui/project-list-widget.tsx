'use client'

import type { Project, ProjectAction } from '@/entities/project'
import { ProjectSection } from '@/features/project'

export interface ProjectListWidgetProps {
  hostProjects: Project[]
  invitedProjects: Project[]
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
  onViewAllHost?: () => void
  onViewAllInvited?: () => void
  onProjectCreated?: (projectId: string) => void
}

export function ProjectListWidget({
  hostProjects,
  invitedProjects,
  onProjectClick,
  onProjectAction,
  onViewAllHost,
  onViewAllInvited,
  onProjectCreated,
}: ProjectListWidgetProps) {
  return (
    <div className="flex flex-col gap-14">
      {/* Host Section */}
      <ProjectSection
        variant="host"
        projects={hostProjects}
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
        {...(onViewAllHost && { onViewAll: onViewAllHost })}
        {...(onProjectCreated && { onProjectCreated })}
      />

      {/* Invited Section */}
      <ProjectSection
        variant="invited"
        projects={invitedProjects}
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
        {...(onViewAllInvited && { onViewAll: onViewAllInvited })}
      />
    </div>
  )
}
