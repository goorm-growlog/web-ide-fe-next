// 프로젝트 이벤트 핸들러 통합 타입 정의

import type { ProjectAction } from './types'

// 기본 이벤트 핸들러들
export type ProjectClickHandler = (projectId: string) => void
export type ProjectActionHandler = (
  projectId: string,
  action: ProjectAction,
) => void

// 컴포넌트별 이벤트 핸들러 인터페이스
export interface ProjectEventHandlers {
  onProjectClick?: ProjectClickHandler
  onProjectAction?: ProjectActionHandler
}

export interface ProjectListEventHandlers extends ProjectEventHandlers {
  onCreateProject?: () => void
  onViewAllHost?: () => void
  onViewAllInvited?: () => void
}

export interface CreateProjectEventHandlers {
  onSubmit?: (data: { name: string; description?: string }) => void
  onCancel?: () => void
}
