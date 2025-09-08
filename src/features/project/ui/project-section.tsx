import type { Project, ProjectAction } from '../model/types'
import { HostProjectSection } from './host-project-section'
import { InvitedProjectSection } from './invited-project-section'

interface ProjectSectionProps {
  variant: 'host' | 'invited'
  projects: Project[]
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
  onViewAll?: () => void
  onProjectCreated?: (projectId: string) => void
}

export const ProjectSection = ({
  variant,
  projects,
  onProjectClick,
  onProjectAction,
  onViewAll,
  onProjectCreated,
}: ProjectSectionProps) => {
  if (variant === 'host') {
    return (
      <HostProjectSection
        projects={projects}
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
        {...(onViewAll && { onViewAll })}
        {...(onProjectCreated && { onProjectCreated })}
      />
    )
  }

  return (
    <InvitedProjectSection
      projects={projects}
      {...(onProjectClick && { onProjectClick })}
      {...(onProjectAction && { onProjectAction })}
      {...(onViewAll && { onViewAll })}
    />
  )
}
