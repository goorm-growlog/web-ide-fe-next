'use client'

import { Edit2, Trash2 } from 'lucide-react'
import type { Project } from '../model/types'
import { ProjectMemberAvatars } from './project-member-avatars'

interface ProjectListItemProps {
  project: Project
  onProjectClick?: ((project: Project) => void) | undefined
}

export const ProjectListItem = ({
  project,
  onProjectClick,
}: ProjectListItemProps) => {
  const handleClick = () => {
    onProjectClick?.(project)
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
        onClick={handleClick}
      >
        <div className="min-w-0 flex-[4]">
          <div className="mb-4">
            <div className="flex items-center gap-1">
              <div className="flex h-2 w-1 flex-shrink-0 items-center justify-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}
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

      {/* 호버 시에만 나타나는 액션 버튼들 */}
      <div className="absolute top-2 right-2 hidden items-center group-hover:flex">
        {/* 편집 아이콘 */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
          aria-label="프로젝트 편집"
          onClick={e => {
            e.stopPropagation()
            // TODO: 편집 기능 구현
          }}
        >
          <Edit2 className="h-4 w-4 text-gray-600" />
        </button>

        {/* 삭제 아이콘 */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-50"
          aria-label="프로젝트 삭제"
          onClick={e => {
            e.stopPropagation()
            // TODO: 삭제 기능 구현
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  )
}
