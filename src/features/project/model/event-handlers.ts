// 이벤트 핸들러 타입 정의

import type { ProjectAction } from './types'

export interface ProjectEventHandlers {
  onProjectClick?: (projectId: string) => void
  onProjectAction?: (projectId: string, action: ProjectAction) => void
  onCreateProject?: () => void
}

export interface ProjectListEventHandlers extends ProjectEventHandlers {
  onViewAllHost?: () => void
  onViewAllInvited?: () => void
}

export interface CreateProjectEventHandlers {
  onSubmit?: (data: { name: string; description?: string }) => void
  onCancel?: () => void
}
