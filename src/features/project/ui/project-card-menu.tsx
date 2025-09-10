import { MoreVertical } from 'lucide-react'
import type { ProjectAction } from '@/entities/project'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

interface ProjectCardMenuProps {
  projectId: number
  onProjectAction?:
    | ((projectId: number, action: ProjectAction) => void)
    | undefined
}

/**
 * 프로젝트 카드 액션 메뉴 컴포넌트
 */
export function ProjectCardMenu({
  projectId,
  onProjectAction,
}: ProjectCardMenuProps) {
  const handleMenuAction = (action: ProjectAction) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onProjectAction?.(projectId, action)
  }

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
          edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMenuAction('delete')}
          className="text-destructive"
        >
          delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
