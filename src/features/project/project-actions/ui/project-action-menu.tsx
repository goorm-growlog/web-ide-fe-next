'use client'

import { MoreVertical } from 'lucide-react'
import type { Project } from '@/entities/project'
import { canInactivateProject, shouldShowProjectMenu } from '@/entities/project'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

interface ProjectActionMenuProps {
  project: Project
  onEdit?: (project: Project) => void
  onInactivate?: (project: Project) => void
  onDelete?: (project: Project) => void
}

/**
 * 프로젝트 액션 메뉴 컴포넌트 (Features 레이어)
 * 비즈니스 로직과 UI 액션을 담당
 */
export function ProjectActionMenu({
  project,
  onEdit,
  onInactivate,
  onDelete,
}: ProjectActionMenuProps) {
  const handleMenuAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    action()
  }

  // 비즈니스 로직은 엔티티의 permissions 모델에서 처리
  if (!shouldShowProjectMenu(project)) {
    return null
  }

  const canInactivate = canInactivateProject(project)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-1 h-8 w-8 p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          onClick={e => e.stopPropagation()}
        >
          <MoreVertical className="h-3.5 w-3.5 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={-6}
        alignOffset={2}
        className="min-w-fit border px-2 py-1 shadow-sm"
      >
        {onEdit && (
          <DropdownMenuItem onClick={handleMenuAction(() => onEdit(project))}>
            Edit Project
          </DropdownMenuItem>
        )}

        {canInactivate && onInactivate && (
          <DropdownMenuItem
            onClick={handleMenuAction(() => onInactivate(project))}
            className="text-amber-600"
          >
            Inactivate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        {onDelete && (
          <DropdownMenuItem
            onClick={handleMenuAction(() => onDelete(project))}
            className="text-destructive"
          >
            Delete Project
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
