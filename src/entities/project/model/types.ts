// 프로젝트 엔티티 타입 정의 (도메인 모델)

export type ProjectRole = 'OWNER' | 'READ' | 'WRITE'
export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'DELETING' | 'DELETED'
export type ProjectAction =
  | 'edit'
  | 'delete'
  | 'share'
  | 'settings'
  | 'inactivate'
export type OwnerOnlyAction = 'edit' | 'delete' | 'inactivate'

export interface ProjectMember {
  userId: number
  name: string
  email: string
  profileImageUrl?: string
  role: ProjectRole
}

export interface Project {
  projectId: number
  projectName: string
  description: string
  ownerName: string
  memberNames: string[]
  memberProfiles: ProjectMember[]
  myRole: ProjectRole
  status: ProjectStatus | string // API에서 다른 상태가 올 수 있어 string 유지
  createdAt: string
  updatedAt: string
}

export interface CreateProjectData {
  projectName: string
  description?: string
  // imageId는 항상 0으로 고정되므로 클라이언트에서 전달하지 않음
}
