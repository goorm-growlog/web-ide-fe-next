import { calculateMemberCount } from '@/entities/project/model/project-service'
import type { Project } from '@/entities/project/model/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

interface ProjectMemberAvatarsProps {
  project: Project
  variant?: 'host' | 'invited'
}

/**
 * 프로젝트 멤버 아바타 표시 컴포넌트 (순수 프레젠테이션)
 * UI 레이어: 비즈니스 로직은 Model 레이어에서 가져옴
 */
export function ProjectMemberAvatars({
  project,
  variant = 'host',
}: ProjectMemberAvatarsProps) {
  const { visibleMembers, remainingCount } = calculateMemberCount(project)

  return (
    <div
      className={`flex w-full flex-wrap items-start justify-end gap-0 pr-1 ${
        variant === 'invited' ? '-mt-2' : 'mt-7'
      }`}
    >
      {visibleMembers.map((member, index) => (
        <Avatar
          key={`${project.projectId}-member-${index}`}
          className="-mr-[9px] h-8 w-8 border-2 border-background"
        >
          <AvatarImage src={member.profileImageUrl} alt={member.name} />
          <AvatarFallback className="bg-muted text-xs">
            {member.name[0]?.toUpperCase()}
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
  )
}
