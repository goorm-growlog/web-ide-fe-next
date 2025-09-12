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
  onProjectUpdated?: (() => void) | undefined
}

interface ProjectActionHandlers {
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onInactivate: (project: Project) => void
}

// 간단한 액션 핸들러 생성 함수 - ProjectSection이 기대하는 시그니처에 맞춤
function createProjectActionHandler(handlers: ProjectActionHandlers) {
  return (_projectId: number, action: string, project: Project) => {
    switch (action) {
      case 'edit':
        handlers.onEdit(project)
        break
      case 'delete':
        handlers.onDelete(project)
        break
      case 'inactivate':
        handlers.onInactivate(project)
        break
    }
  }
}

/**
 * 프로젝트 목록 위젯 - Feature들을 조합하여 완전한 기능 제공
 */
export function ProjectListWidget({
  hostProjects,
  invitedProjects,
  onProjectClick,
  onProjectCreated,
  onProjectUpdated,
}: ProjectListWidgetProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // 프로젝트 액션 핸들러들
  const projectActionHandlers: ProjectActionHandlers = {
    onEdit: project => {
      console.log('Edit project:', project.projectName)
      // TODO: EditProjectDialog 구현
    },
    onDelete: project => {
      console.log('Delete project:', project.projectName)
      // TODO: Delete 확인 다이얼로그 구현
      onProjectUpdated?.()
    },
    onInactivate: project => {
      console.log('Inactivate project:', project.projectName)
      // TODO: Inactivate 확인 다이얼로그 구현
      onProjectUpdated?.()
    },
  }

  const handleProjectAction = createProjectActionHandler(projectActionHandlers)

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
        onProjectAction={handleProjectAction}
      />

      {/* Invited Section */}
      <ProjectSection
        title="Invited"
        projects={invitedProjects}
        maxDisplay={4}
        variant="invited"
        {...(onProjectClick && { onProjectClick })}
        onProjectAction={handleProjectAction}
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
