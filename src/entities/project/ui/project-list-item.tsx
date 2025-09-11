'use client'

import type { Project, ProjectAction } from '../model/types'
import { ProjectCardMenu } from './project-card-menu'
import { ProjectMemberAvatars } from './project-member-avatars'

interface ProjectListItemProps {
  project: Project
  onProjectClick?: ((project: Project) => void) | undefined
  onProjectAction?: (projectId: number, action: ProjectAction) => void
}

export const ProjectListItem = ({
  project,
  onProjectClick,
  onProjectAction,
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

      <ProjectCardMenu
        projectId={project.projectId}
        onProjectAction={onProjectAction}
      />
    </div>
  )
}
