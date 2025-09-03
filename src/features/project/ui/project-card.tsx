import { MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import type { Project, ProjectAction } from '../model/types'

interface ProjectCardProps {
  project: Project
  height?: string
  onProjectClick?: (projectId: string) => void
  onProjectAction?: (projectId: string, action: ProjectAction) => void
}

export const ProjectCard = ({
  project,
  height = 'h-[150px]',
  onProjectClick,
  onProjectAction,
}: ProjectCardProps) => {
  const handleCardClick = () => {
    onProjectClick?.(project.id)
  }

  const handleMenuAction = (action: ProjectAction) => {
    onProjectAction?.(project.id, action)
  }

  const visibleMembers = project.members.slice(0, 3)
  const remainingCount = Math.max(0, project.memberCount - 3)

  const cardHeightClass = height ? `h-[${height}]` : 'h-[150px]'

  return (
    <Card
      className={`group relative w-full cursor-pointer border-border/60 bg-transparent transition-none hover:border-border/60 ${cardHeightClass}`}
      onClick={handleCardClick}
    >
      <CardContent className="flex h-full flex-col justify-between p-3">
        {/* Project Info */}
        <div className="flex flex-col gap-[11px]">
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
        <div className="flex items-center justify-end gap-0 pr-[9px]">
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
              className="absolute top-4 right-3 h-3.5 w-3.5 p-0 hover:bg-transparent"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleMenuAction('edit')}>
              수정
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('share')}>
              공유
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
              설정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuAction('delete')}
              className="text-destructive"
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
