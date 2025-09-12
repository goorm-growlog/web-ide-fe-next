'use client'

import type { ReactNode } from 'react'
import { isProjectDeleting } from '../model/permissions'
import type { Project } from '../model/types'
import { ProjectMemberAvatars } from './project-member-avatars'

interface ProjectListItemProps {
  project: Project
  onProjectClick?: ((project: Project) => void) | undefined
  // 슬롯 패턴 사용 - 액션은 외부에서 주입
  actionSlot?: ReactNode
}

/**
 * 프로젝트 목록 아이템 컴포넌트 (순수 UI)
 * 비즈니스 로직은 entities의 permissions 모델에서 처리됨
 */
export const ProjectListItem = ({
  project,
  onProjectClick,
  actionSlot,
}: ProjectListItemProps) => {
  const isDeleting = isProjectDeleting(project)

  const handleClick = () => {
    if (!isDeleting) {
      onProjectClick?.(project)
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
          isDeleting
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-gray-50'
        }`}
        onClick={handleClick}
        disabled={isDeleting}
      >
        <div className="min-w-0 flex-[4]">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-1 flex-shrink-0 items-center justify-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={project.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                />
              </div>
              <h3 className="max-w-[30%] truncate font-medium text-gray-900">
                {project.projectName}
              </h3>
            </div>
            {project.description && (
              <p className="mt-1 max-w-[40%] truncate text-gray-500 text-sm">
                {project.description}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-gray-400 text-xs">
            <span>
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-1 items-center justify-center">
          <ProjectMemberAvatars project={project} />
        </div>
      </button>

      {actionSlot}
    </div>
  )
}
