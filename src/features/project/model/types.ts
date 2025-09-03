// 프로젝트 관련 핵심 타입 정의

export interface ProjectMember {
  id: string
  name: string
  avatar?: string
  email: string
  role: 'owner' | 'member'
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  owner: ProjectMember
  members: ProjectMember[]
  memberCount: number
  status: 'active' | 'inactive'
  isOwner: boolean
  isInvited: boolean
}

export interface CreateProjectData {
  name: string
  description?: string
}

export type ProjectStatus = 'host' | 'invited'

export type ProjectAction = 'edit' | 'delete' | 'share' | 'settings'
