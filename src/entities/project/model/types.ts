// 프로젝트 엔티티 타입 정의 (도메인 모델)

export interface ProjectMember {
  userId: number
  name: string
  email: string
  profileImageUrl?: string
  role: 'OWNER' | 'READ' | 'WRITE'
}

export interface Project {
  projectId: number
  projectName: string
  description: string
  ownerName: string
  memberNames: string[]
  memberProfiles: ProjectMember[] // 확장된 멤버 정보
  myRole: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectData {
  projectName: string
  description?: string
  imageId?: number
}

export type ProjectStatus = 'host' | 'invited'

export type ProjectAction = 'edit' | 'delete' | 'share' | 'settings'
