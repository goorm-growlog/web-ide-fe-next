'use client'

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
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
      onClick={handleClick}
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
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
          <span>{project.memberProfiles?.length ?? 0} members</span>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <ProjectMemberAvatars project={project} />
      </div>
    </button>
  )
}
