import { MoreVertical } from 'lucide-react'
import {
  calculateMemberCount,
  createStopPropagationHandler,
} from '@/features/project/model/project-utils'
import type { Project, ProjectAction } from '@/features/project/model/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

interface ProjectCardProps {
  project: Project
  height?: string
  variant?: 'host' | 'invited'
  onProjectClick?: (projectId: string) => void
  onProjectAction?: (projectId: string, action: ProjectAction) => void
}

export const ProjectCard = ({
  project,
  height = '150px',
  variant = 'host',
  onProjectClick,
  onProjectAction,
}: ProjectCardProps) => {
  const handleCardClick = () => {
    onProjectClick?.(project.id)
  }

  const handleMenuAction = (action: ProjectAction) =>
    createStopPropagationHandler(() => onProjectAction?.(project.id, action))

  const { visibleMembers, remainingCount } = calculateMemberCount(project)

  return (
    <Card
      className="group relative w-full cursor-pointer border-border/60 bg-transparent transition-all duration-200 hover:border-border/60 hover:shadow-md"
      style={{ height }}
      onClick={handleCardClick}
    >
      <CardContent className="flex h-full flex-col justify-between p-3">
        {/* Project Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2.5">
            <h3 className="w-[104px] truncate font-semibold text-foreground/80 text-sm leading-5">
              {project.name}
            </h3>
            <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center">
              {/* Status Indicator */}
              <div
                className={`h-3 w-3 rounded-full ${
                  project.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <p className="line-clamp-2 font-medium text-muted-foreground/50 text-xs leading-5">
            {project.description || 'No description'}
          </p>
        </div>

        {/* User Icons */}
        <div
          className={`flex w-full flex-wrap items-start justify-end gap-0 pr-1 ${variant === 'invited' ? '-mt-2' : 'mt-7'}`}
        >
          {visibleMembers.map(member => (
            <Avatar
              key={member.id}
              className="-mr-[9px] h-8 w-8 border-2 border-background"
            >
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-muted text-xs">
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="-mr-[9px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted-foreground">
              <span className="font-medium text-background text-sm">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>

        {/* Menu Button */}
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
      </CardContent>
    </Card>
  )
}
