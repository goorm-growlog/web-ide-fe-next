'use client'

import type { Project } from '@/entities/project'
import { ProjectCard } from '@/entities/project'
import { EmptyState } from './empty-state'
import { ProjectSectionHeader } from './project-section-header'

interface ProjectSectionProps {
  title: string
  projects: Project[]
  maxDisplay: number
  createSlot?: React.ReactNode
  onProjectClick?: ((projectId: number) => void) | undefined
  onProjectAction?:
    | ((projectId: number, action: string, project: Project) => void)
    | undefined
  variant?: 'host' | 'invited'
}

export function ProjectSection({
  title,
  projects,
  maxDisplay,
  createSlot,
  onProjectClick,
  onProjectAction,
  variant = 'host',
}: ProjectSectionProps) {
  // 생성 슬롯이 있으면 표시할 프로젝트 수를 조정
  const showCreateSlot = createSlot && projects.length < maxDisplay
  const adjustedMaxDisplay = showCreateSlot ? maxDisplay - 1 : maxDisplay
  const displayedProjects = projects.slice(0, adjustedMaxDisplay)

  // 높이 계산 (Host: 150px, Invited: 260px)
  const sectionHeight = variant === 'host' ? '150px' : '260px'

  // 그리드 설정 (Host: 3열, Invited: 2열)
  const gridCols = variant === 'host' ? 'grid-cols-3' : 'grid-cols-2'

  // 카드 높이 (Host: 150px, Invited: 115px)
  const cardHeight = variant === 'host' ? '150px' : '115px'

  return (
    <div className="flex flex-col gap-2" style={{ height: sectionHeight }}>
      <ProjectSectionHeader
        title={title}
        totalCount={projects.length}
        projects={projects}
        {...(onProjectClick && {
          onProjectSelect: (project: Project) =>
            onProjectClick(project.projectId),
        })}
      />

      {/* 빈 프로젝트일 때 EmptyState 표시 (invited variant에서만) */}
      {projects.length === 0 && variant === 'invited' ? (
        <div className="h-full rounded-lg border border-border/50">
          <EmptyState />
        </div>
      ) : (
        <div className={`grid gap-2 ${gridCols}`}>
          {showCreateSlot && createSlot}

          {displayedProjects.map(project => (
            <ProjectCard
              key={project.projectId}
              project={project}
              height={cardHeight}
              variant={variant}
              {...(onProjectClick && { onProjectClick })}
              {...(onProjectAction && { onProjectAction })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
