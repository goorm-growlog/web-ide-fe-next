import type { Project } from '@/entities/project'
import { isProjectDeleting } from '@/entities/project'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { ProjectMemberAvatars } from './project-member-avatars'

interface ProjectCardProps {
  project: Project
  height?: string
  variant?: 'host' | 'invited'
  onProjectClick?: ((projectId: number) => void) | undefined
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
}: ProjectCardProps) => {
  const isDeleting = isProjectDeleting(project)

  const handleCardClick = () => {
    if (!isDeleting) {
      onProjectClick?.(project.projectId)
    }
  }

  return (
    <Card
      className={`group relative w-full border-border/60 bg-transparent transition-all duration-200 hover:border-border/60 hover:shadow-md ${
        isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      style={{ height }}
      onClick={handleCardClick}
    >
      <CardContent className="flex h-full flex-col justify-between p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2.5">
            <h3 className="max-w-[104px] truncate font-semibold text-foreground/80 text-sm leading-5">
              {project.projectName}
            </h3>
            <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center">
              <div
                className={`h-3 w-3 rounded-full ${
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
      </CardContent>
    </Card>
  )
}
