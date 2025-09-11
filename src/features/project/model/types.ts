// 프로젝트 feature의 로컬 타입 정의 (entities/project에서 import)

// 핵심 타입들은 entities/project에서 가져옴
export type {
  CreateProjectData,
  Project,
  ProjectMember,
} from '@/entities/project'

// Feature에 특화된 추가 타입들
export type ProjectStatus = 'host' | 'invited'

export type ProjectAction = 'edit' | 'delete' | 'share' | 'settings'
