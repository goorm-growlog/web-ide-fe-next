// 프로젝트 관련 API 클라이언트 함수들

import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type {
  CreateProjectApiResponse,
  CreateProjectRequest,
  ProjectDetailApiResponse,
  ProjectListApiResponse,
} from '../model/api'
import type { Project } from '../model/types'

/**
 * 프로젝트 목록을 조회합니다.
 * @param type - 'own' (내가 만든 프로젝트) | 'joined' (참여 중인 프로젝트) | undefined (전체)
 * @returns 프로젝트 목록
 */
export async function getProjects(type?: 'own' | 'joined'): Promise<Project[]> {
  const searchParams = type ? { type } : {}

  const response = await authApi
    .get('projects', { searchParams })
    .json<ProjectListApiResponse>()

  return apiHelpers.extractData(response)
}

/**
 * 새로운 프로젝트를 생성합니다.
 * @param data - 프로젝트 생성 데이터
 * @returns 생성된 프로젝트 정보
 */
export async function createProject(
  data: CreateProjectRequest,
): Promise<Project> {
  const response = await authApi
    .post('projects', { json: data })
    .json<CreateProjectApiResponse>()

  return apiHelpers.extractData(response)
}

/**
 * 프로젝트 상세 정보를 조회합니다.
 * @param projectId - 프로젝트 ID
 * @returns 프로젝트 상세 정보
 */
export async function getProject(projectId: number): Promise<Project> {
  const response = await authApi
    .get(`projects/${projectId}`)
    .json<ProjectDetailApiResponse>()

  return apiHelpers.extractData(response)
}

/**
 * 프로젝트 정보를 수정합니다.
 * @param projectId - 프로젝트 ID
 * @param data - 수정할 프로젝트 데이터
 * @returns 수정된 프로젝트 정보
 */
export async function updateProject(
  projectId: number,
  data: { projectName?: string; description?: string },
): Promise<Project> {
  const response = await authApi
    .patch(`projects/${projectId}`, { json: data })
    .json<ProjectDetailApiResponse>()

  return apiHelpers.extractData(response)
}

/**
 * 프로젝트를 삭제합니다.
 * @param projectId - 프로젝트 ID
 * @returns 삭제 결과 메시지
 */
export async function deleteProject(projectId: number): Promise<string> {
  const response = await authApi
    .delete(`projects/${projectId}`)
    .json<ApiResponse<string>>()

  return apiHelpers.extractData(response)
}
