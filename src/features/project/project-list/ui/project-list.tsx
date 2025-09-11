'use client'

import type { Project } from '@/entities/project'
import { ProjectMemberAvatars } from '@/entities/project'

export interface ProjectListProps {
  projects: Project[]
  onProjectSelect?: ((project: Project) => void) | undefined
}

export function ProjectList({ projects, onProjectSelect }: ProjectListProps) {
  const handleProjectClick = (project: Project) => {
    onProjectSelect?.(project)
  }

  return (
    <div className="flex max-h-[420px] flex-col">
      {/* 프로젝트 목록 - 스크롤 영역 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 상단 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-100 h-4 bg-gradient-to-b from-white via-white/70 via-white/95 to-transparent" />

        {/* 하단 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-100 h-4 bg-gradient-to-t from-white via-white/70 via-white/95 to-transparent" />

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
                <button
                  key={project.projectId}
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-gray-900">
                      {project.projectName}
                    </h3>
                    {project.description && (
                      <p className="mt-1 truncate text-gray-500 text-sm">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-gray-400 text-xs">
                      <span>
                        Updated{' '}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <span>{project.memberProfiles?.length ?? 0} members</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
