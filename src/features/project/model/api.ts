// Feature layer에 특화된 API 응답 타입 정의

import type { Project } from '@/entities/project'

// 프로젝트 목록 API 응답 형태 (feature에서 사용하는 조합된 응답)
export interface GetProjectsResponse {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
}
