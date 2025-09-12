'use client'

import { useState } from 'react'
import type { Project } from '@/entities/project'
import { useProjectActions } from '@/features/project/project-actions'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/shadcn/dialog'
import { useProjectSearch } from '../model/use-project-search'
import { ProjectList } from './project-list'
import { ProjectSearch } from './project-search'

interface ProjectListModalProps {
  trigger: React.ReactNode
  projects: Project[]
  onProjectSelect?: (project: Project) => void
}

export const ProjectListModal = ({
  trigger,
  projects,
  onProjectSelect,
}: ProjectListModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const filteredProjects = useProjectSearch(projects, searchKeyword)

  // 모달에서 프로젝트 액션 호출 (독립적인 모달 컨텍스트)
  const projectActions = useProjectActions()

  const handleProjectSelect = (project: Project) => {
    onProjectSelect?.(project)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="!bg-white h-[500px] w-full max-w-[95vw] p-0 sm:max-w-[845px] [&>button]:hidden">
        <DialogTitle className="sr-only">Project List</DialogTitle>
        <div className="flex h-[500px] flex-col p-5">
          <ProjectSearch
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="Search projects..."
          />

          {filteredProjects.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg">
              <div className="text-center text-muted-foreground text-sm">
                No projects found for your search.
              </div>
            </div>
          ) : (
            <ProjectList
              projects={filteredProjects}
              onProjectSelect={handleProjectSelect}
              projectActions={projectActions}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
