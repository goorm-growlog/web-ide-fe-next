'use client'

import { useState } from 'react'
import type { Project, ProjectAction } from '@/entities/project'
import { ProjectCard } from '@/entities/project'
import { CreateProjectCard } from '../../project-create/ui/create-project-card'
import { CreateProjectDialog } from '../../project-create/ui/create-project-dialog'
import { ProjectSectionHeader } from './project-section-header'

interface HostProjectSectionProps {
  projects: Project[]
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
  onViewAll?: () => void
  onProjectCreated?: (projectId: string) => void
}

export const HostProjectSection = ({
  projects,
  onProjectClick,
  onProjectAction,
  onViewAll,
  onProjectCreated,
}: HostProjectSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Host는 생성 카드를 포함해서 최대 3개까지 표시
  const showCreateCard = projects.length < 3
  const maxProjects = showCreateCard ? 2 : 3 // 생성 카드가 있으면 2개, 없으면 3개
  const displayedProjects = projects.slice(0, maxProjects)

  return (
    <div className="flex flex-col gap-2" style={{ height: '150px' }}>
      <ProjectSectionHeader
        title="Host"
        totalCount={projects.length}
        {...(onViewAll && { onViewAll })}
      />

      <div className="grid grid-cols-3 gap-2">
        {showCreateCard && (
          <CreateProjectCard
            onClick={() => setIsCreateDialogOpen(true)}
            height="150px"
          />
        )}

        {displayedProjects.map(project => (
          <ProjectCard
            key={project.projectId}
            project={project}
            height="150px"
            variant="host"
            {...(onProjectClick && { onProjectClick })}
            {...(onProjectAction && { onProjectAction })}
          />
        ))}
      </div>

      {showCreateCard && (
        <CreateProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={projectId => {
            onProjectCreated?.(projectId)
            setIsCreateDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}
