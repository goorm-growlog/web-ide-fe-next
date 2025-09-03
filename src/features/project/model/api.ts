// API 관련 타입 정의

import type { CreateProjectData, Project } from './types'

export interface GetProjectsResponse {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
}

export interface CreateProjectRequest extends CreateProjectData {}

export interface CreateProjectResponse {
  project: Project
}

export interface ProjectAPIError {
  code: string
  message: string
  details?: Record<string, unknown>
}
