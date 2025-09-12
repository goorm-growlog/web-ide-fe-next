'use client'

import type { Project } from '@/entities/project'
import { ProjectListItem } from '@/entities/project'
import {
  ProjectActionMenu,
  useProjectActions,
} from '@/features/project/project-actions'

export interface ProjectListProps {
  projects: Project[]
  onProjectSelect?: ((project: Project) => void) | undefined
}

export function ProjectList({ projects, onProjectSelect }: ProjectListProps) {
  const { handleEditProject, handleInactivateProject, handleDeleteProject } =
    useProjectActions()
  return (
    <div className="flex max-h-[420px] flex-col">
      {/* 프로젝트 목록 - 스크롤 영역 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 상단 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-4 bg-gradient-to-b from-white via-white/70 via-white/95 to-transparent" />

        {/* 하단 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-4 bg-gradient-to-t from-white via-white/70 via-white/95 to-transparent" />

        <div
          className="h-full overflow-y-auto pr-1 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#eaeaeaff transparent',
          }}
        >
          <div className="space-y-3 py-3 pr-1">
            {projects.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {'No projects available'}
              </div>
            ) : (
              projects.map(project => (
                <ProjectListItem
                  key={project.projectId}
                  project={project}
                  onProjectClick={onProjectSelect}
                  actionSlot={
                    <ProjectActionMenu
                      project={project}
                      onEdit={handleEditProject}
                      onInactivate={handleInactivateProject}
                      onDelete={handleDeleteProject}
                    />
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
