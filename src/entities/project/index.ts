// 프로젝트 엔티티 공개 인터페이스

// API 함수들
export {
  createProject,
  deleteProject,
  getProject,
  getProjectMembers,
  getProjects,
  inactivateProject,
  updateProject,
} from './api/project'
// Hooks (데이터 페칭)
export * from './hooks/use-project'
// 권한 및 상태 체크 함수들
export {
  canInactivateProject,
  canPerformAction,
  isOwnerOnlyAction,
  isProjectActive,
  isProjectDeleting,
  isProjectOwner,
  shouldShowProjectMenu,
} from './model/permissions'
// Utils (순수 함수들)
export type {
  MemberCountResult,
  MemberDisplayInfo,
} from './model/project-service'
export {
  calculateMemberCount,
  getEnrichedProjectsByType,
} from './model/project-service'
// 타입들
export type {
  CreateProjectData,
  OwnerOnlyAction,
  Project,
  ProjectAction,
  ProjectMember,
  ProjectRole,
  ProjectStatus,
} from './model/types'

// UI 컴포넌트들 (순수)
export { ProjectCard } from './ui/project-card'
export * from './ui/project-grid'
export { ProjectListItem } from './ui/project-list-item'
export { ProjectMemberAvatars } from './ui/project-member-avatars'
export { ProjectListSkeleton } from './ui/project-skeleton'
