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

interface ProjectCardMenuProps {
  projectId: number
  project: Project
  onProjectAction?:
    | ((projectId: number, action: string, project: Project) => void)
    | undefined
}

/**
 * 프로젝트 카드 액션 메뉴 컴포넌트 (순수 UI)
 * 비즈니스 로직은 permissions 모델에서 처리됨
 */
export function ProjectCardMenu({
  projectId,
  project,
  onProjectAction,
}: ProjectCardMenuProps) {
  const handleMenuAction = (action: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onProjectAction?.(projectId, action, project)
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
        <DropdownMenuItem onClick={handleMenuAction('edit')}>
          Edit Project
        </DropdownMenuItem>

        {canInactivate && (
          <DropdownMenuItem
            onClick={handleMenuAction('inactivate')}
            className="text-amber-600"
          >
            Inactivate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleMenuAction('delete')}
          className="text-destructive"
        >
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
