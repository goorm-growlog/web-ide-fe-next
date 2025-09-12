'use client'

import { useState } from 'react'
import type { Project } from '@/entities/project'
import {
  CreateProjectCard,
  CreateProjectDialog,
  ProjectSection,
} from '@/features/project'

interface ProjectListWidgetProps {
  hostProjects: Project[]
  invitedProjects: Project[]
  onProjectClick?: ((projectId: number) => void) | undefined
  onProjectCreated?: ((projectId: string) => void) | undefined
}

/**
 * 프로젝트 목록 위젯 - Feature들을 조합하여 완전한 기능 제공
 */
export function ProjectListWidget({
  hostProjects,
  invitedProjects,
  onProjectClick,
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
      {/* Host Section */}
      <ProjectSection
        title="Host"
        projects={hostProjects}
        maxDisplay={3}
        variant="host"
        createSlot={createProjectSlot}
        {...(onProjectClick && { onProjectClick })}
      />

      {/* Invited Section */}
      <ProjectSection
        title="Invited"
        projects={invitedProjects}
        maxDisplay={4}
        variant="invited"
        {...(onProjectClick && { onProjectClick })}
      />

      {/* Create Project Dialog */}
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
