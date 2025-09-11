'use client'

import { useState } from 'react'
import type { Project, ProjectAction } from '@/entities/project'
import {
  CreateProjectCard,
  CreateProjectDialog,
  ProjectSection,
} from '@/features/project'

export interface ProjectListWidgetProps {
  hostProjects: Project[]
  invitedProjects: Project[]
  onProjectClick?: (projectId: number) => void
  onProjectAction?: (projectId: number, action: ProjectAction) => void
  onProjectCreated?: (projectId: string) => void
}

export function ProjectListWidget({
  hostProjects,
  invitedProjects,
  onProjectClick,
  onProjectAction,
  onProjectCreated,
}: ProjectListWidgetProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // CreateProject 슬롯 컴포넌트 - Widget에서 Feature 조합
  const createProjectSlot = (
    <CreateProjectCard
      onClick={() => setIsCreateDialogOpen(true)}
      height="150px"
    />
  )

  return (
    <div className="flex flex-col gap-14">
      {/* Host Section - 통합된 ProjectSection 사용 */}
      <ProjectSection
        title="Host"
        projects={hostProjects}
        maxDisplay={3}
        variant="host"
        createSlot={createProjectSlot}
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
      />

      {/* Invited Section - 통합된 ProjectSection 사용 */}
      <ProjectSection
        title="Invited"
        projects={invitedProjects}
        maxDisplay={4}
        variant="invited"
        {...(onProjectClick && { onProjectClick })}
        {...(onProjectAction && { onProjectAction })}
      />

      {/* CreateProject Dialog - Widget에서 관리 */}
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={projectId => {
          onProjectCreated?.(projectId)
          setIsCreateDialogOpen(false)
        }}
      />
    </div>
  )
}
