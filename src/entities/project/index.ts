// 프로젝트 엔티티 Public API (FSD 원칙)

// API (순수 CRUD)
export * from './api/project'

// Hooks (데이터 페칭)
export * from './hooks/use-project'
// Utils (순수 함수들)
export type {
  MemberCountResult,
  MemberDisplayInfo,
} from './model/project-service'
export {
  calculateMemberCount,
  getEnrichedProjectsByType,
} from './model/project-service'
// Types (비즈니스 모델)
export type {
  CreateProjectData,
  Project,
  ProjectAction,
  ProjectMember,
  ProjectStatus,
} from './model/types'
