// API 관련 타입 정의 (실제 API 스키마 기반)

import type { ApiResponse } from '@/shared/types/api'
import type { Project } from './types'

export interface GetProjectsResponse {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
}

// API 스키마 기반 타입들
export interface CreateProjectRequest {
  projectName: string
  description?: string
  imageId?: number
}

export interface ProjectResponse {
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

// API 응답 타입들
export type ProjectListApiResponse = ApiResponse<ProjectResponse[]>
export type CreateProjectApiResponse = ApiResponse<ProjectResponse>
export type ProjectDetailApiResponse = ApiResponse<ProjectResponse>
