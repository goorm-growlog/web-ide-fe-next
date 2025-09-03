'use client'

import { Circle, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'
import type { Project } from '../model/types'

interface ProjectCardProps {
  project: Project
  onMoreClick?: (project: Project) => void
  onClick?: (project: Project) => void
}

const ProjectCard = ({ project, onMoreClick, onClick }: ProjectCardProps) => {
  const handleCardClick = () => {
    onClick?.(project)
  }

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoreClick?.(project)
  }

  // 상태 아이콘 색상 결정
  const getStatusColor = () => {
    if (project.isOwner) return 'text-chart-1' // 성공/소유자 상태
    if (project.isInvited) return 'text-destructive' // 초대/경고 상태
    return 'text-muted-foreground' // 기본 상태
  }

  // 멤버 수 표시 (3명까지만 아바타, 나머지는 +N)
  const visibleMembers = project.memberCount > 3 ? 3 : project.memberCount
  const remainingCount = project.memberCount - 3

  return (
    <Card
      className="relative h-[150px] w-[270px] cursor-pointer border-border transition-colors hover:border-ring"
      onClick={handleCardClick}
    >
      <div className="flex h-full flex-col justify-between p-3">
        {/* 프로젝트 정보 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="max-w-[104px] truncate font-semibold text-foreground text-sm">
              {project.projectName}
            </h3>
            <Circle className={`h-3 w-3 ${getStatusColor()}`} />
          </div>
          <p className="line-clamp-2 text-muted-foreground text-xs">
            {project.description}
          </p>
        </div>

        {/* 멤버 아바타들 */}
        <div className="flex items-center justify-end gap-0">
          {Array.from({ length: visibleMembers }).map((_, index) => (
            <Avatar
              key={`${project.projectId}-member-${index}`}
              className="-mr-2 h-8 w-8 border-2 border-background"
            >
              <AvatarImage src={project.ownerProfileImageUrl} />
              <AvatarFallback className="bg-muted text-xs">
                {project.ownerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="-mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary font-medium text-primary-foreground text-xs">
              +{remainingCount}
            </div>
          )}
        </div>

        {/* 더보기 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-6 w-6 p-0 hover:bg-accent"
          onClick={handleMoreClick}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  )
}

export default ProjectCard
