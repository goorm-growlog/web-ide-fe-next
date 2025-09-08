'use client'

import { useState } from 'react'
import type { Project, ProjectAction } from '@/features/project/model/types'
import { CreateProjectCard } from '@/features/project/project-create/ui/create-project-card'
import { CreateProjectDialog } from '@/features/project/project-create/ui/create-project-dialog'
import { EmptyInvitedState } from '@/features/project/project-list/ui/empty-invited-state'
import { ProjectSectionHeader } from '@/features/project/project-list/ui/project-section-header'
import { ProjectCard } from '@/features/project/ui/project-card'

interface ProjectSectionProps {
  title: string
  variant: 'host' | 'invited'
  projects: Project[]
  totalCount: number
  columns: number
  maxItems: number
  showCreateCard?: boolean
  cardHeight: string
  onProjectClick?: (projectId: string) => void
  onProjectAction?: (projectId: string, action: ProjectAction) => void
  onViewAll?: () => void
}

function ProjectSection({
  title,
  variant,
  projects,
  totalCount,
  columns,
  maxItems,
  showCreateCard = false,
  cardHeight,
  onProjectClick,
  onProjectAction,
  onViewAll,
}: ProjectSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const displayedProjects = projects.slice(
    0,
    maxItems - (showCreateCard ? 1 : 0),
  )

  return (
    <div className="flex flex-col gap-3">
      <ProjectSectionHeader
        title={title}
        totalCount={totalCount}
        {...(onViewAll && { onViewAll })}
      />

      {/* Empty state for invited projects when there are no projects */}
      {!showCreateCard && displayedProjects.length === 0 ? (
        <EmptyInvitedState />
      ) : (
        <div
          className={`grid gap-[18px] ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
        >
          {showCreateCard && (
            <CreateProjectCard
              onClick={() => setIsCreateDialogOpen(true)}
              height={cardHeight}
            />
          )}

          {displayedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              height={cardHeight}
              variant={variant}
              {...(onProjectClick && { onProjectClick })}
              {...(onProjectAction && { onProjectAction })}
            />
          ))}
        </div>
      )}

      {showCreateCard && (
        <CreateProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={projectId => {
            console.log('Project created:', projectId)
            // TODO: 프로젝트 목록 새로고침
          }}
        />
      )}
    </div>
  )
}

interface ProjectListWidgetProps {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
  onProjectClick?: (projectId: string) => void
  onProjectAction?: (projectId: string, action: ProjectAction) => void
  onViewAllHost?: () => void
  onViewAllInvited?: () => void
}

export function ProjectListWidget({
  hostProjects,
  invitedProjects,
  totalHost,
  totalInvited,
  onProjectClick,
  onProjectAction,
  onViewAllHost,
  onViewAllInvited,
}: ProjectListWidgetProps) {
  return (
    <div className="flex flex-col gap-[50px]">
      {/* Host Section */}
      <ProjectSection
        title="Host"
        variant="host"
        projects={hostProjects}
        totalCount={totalHost}
        columns={3}
        maxItems={3}
        cardHeight="150px"
        showCreateCard
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
        {...(onViewAllHost && { onViewAll: onViewAllHost })}
      />

      {/* Invited Section */}
      <ProjectSection
        title="Inviteds"
        variant="invited"
        projects={invitedProjects}
        totalCount={totalInvited}
        columns={2}
        maxItems={4}
        cardHeight="115px"
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
        {...(onViewAllInvited && { onViewAll: onViewAllInvited })}
      />
    </div>
  )
}
