// 프로젝트 관련 핵심 타입 정의 (API 스키마 기반)

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
