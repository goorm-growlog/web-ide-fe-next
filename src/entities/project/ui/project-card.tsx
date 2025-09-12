import type { ReactNode } from 'react'
import type { Project } from '@/entities/project'
import {
  canClickProject,
  getProjectTooltip,
  isProjectDeleting,
} from '@/entities/project'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/shadcn/tooltip'
import { ProjectMemberAvatars } from './project-member-avatars'

interface ProjectCardProps {
  project: Project
  height?: string
  variant?: 'host' | 'invited'
  onProjectClick?: ((projectId: number) => void) | undefined
  // 슬롯 패턴 사용 - 액션은 외부에서 주입
  actionSlot?: ReactNode
}

/**
 * 프로젝트 카드 컴포넌트 (순수 UI)
 * 비즈니스 로직은 entities의 permissions 모델에서 처리됨
 */
export const ProjectCard = ({
  project,
  height = '150px',
  variant = 'host',
  onProjectClick,
  actionSlot,
}: ProjectCardProps) => {
  const canClick = canClickProject(project)
  const tooltipMessage = getProjectTooltip(project)
  const isDeleting = isProjectDeleting(project)

  const handleCardClick = () => {
    if (canClick) {
      onProjectClick?.(project.projectId)
    }
  }

  const cardContent = (
    <Card
      className={`group relative w-full border-border/80 bg-transparent pt-12 shadow-none transition-all duration-200 hover:border-border/60 hover:shadow-sm ${
        !canClick ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${isDeleting ? 'opacity-50' : 'opacity-100'}`}
      style={{ height }}
      onClick={handleCardClick}
    >
      <CardContent className="flex h-full flex-col justify-center p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2">
            <h3 className="max-w-[104px] truncate font-semibold text-foreground/80 text-sm leading-5">
              {project.projectName}
            </h3>
            <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center">
              <div
                className={`h-2 w-2 rounded-full ${
                  project.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <p className="line-clamp-2 font-medium text-muted-foreground/50 text-xs leading-5">
            {project.description || 'No description'}
          </p>
        </div>

        <ProjectMemberAvatars project={project} variant={variant} />

        {actionSlot}
      </CardContent>
    </Card>
  )

  // 툴팁이 있으면 감싸서 반환
  if (tooltipMessage) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}
