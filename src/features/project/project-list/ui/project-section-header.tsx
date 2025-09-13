'use client'

import type { Project } from '@/entities/project/model/types'
import { ProjectListModal } from '@/features/project/project-list/ui/project-list-modal'
import { Button } from '@/shared/ui/shadcn/button'

interface ProjectSectionHeaderProps {
  title: string
  totalCount: number
  projects: Project[]
  onProjectSelect?: ((project: Project) => void) | undefined
}

export function ProjectSectionHeader({
  title,
  totalCount,
  projects,
  onProjectSelect,
}: ProjectSectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-semibold text-foreground/80 text-sm leading-5">
        {title}
      </h2>
      {totalCount > 0 && (
        <ProjectListModal
          trigger={
            <Button
              variant="ghost"
              className="h-auto p-0 font-medium text-muted-foreground text-xs hover:text-foreground"
            >
              view all({totalCount})
            </Button>
          }
          projects={projects}
          {...(onProjectSelect && { onProjectSelect })}
        />
      )}
    </div>
  )
}
