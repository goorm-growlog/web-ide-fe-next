// 프로젝트 관련 API 클라이언트 함수들

import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type {
  CreateProjectApiResponse,
  CreateProjectRequest,
  ProjectDetailApiResponse,
  ProjectListApiResponse,
  ProjectMembersApiResponse,
  ProjectResponse,
} from '../model/api'
import type { Project, ProjectMember } from '../model/types'

/**
 * ProjectResponse를 Project 타입으로 변환합니다.
 * @param projectResponse - API 응답 데이터
 * @param memberProfiles - 멤버 프로필 정보 (선택적)
 * @returns Project 타입 데이터
 */
function transformToProject(
  projectResponse: ProjectResponse,
  memberProfiles: ProjectMember[] = [],
): Project {
  return {
    ...projectResponse,
    memberProfiles,
  }
}

/**
 * 프로젝트 목록을 조회합니다.
 * @param type - 'own' (내가 만든 프로젝트) | 'joined' (참여 중인 프로젝트) | undefined (전체)
 * @returns 프로젝트 목록 (멤버 정보 없음)
 */
export async function getProjects(type?: 'own' | 'joined'): Promise<Project[]> {
  const searchParams = type ? { type } : {}

  const response = await authApi
    .get('projects', { searchParams })
    .json<ProjectListApiResponse>()

  const projectResponses = apiHelpers.extractData(response)

  return projectResponses.map(projectResponse =>
    transformToProject(projectResponse, []),
  )
}

/**
 * API 응답을 Project 타입으로 변환하는 내부 헬퍼 함수
 * (순수한 데이터 변환만 담당, 비즈니스 로직 없음)
 */
async function extractProject(
  responsePromise: Promise<ApiResponse<ProjectResponse>>,
): Promise<Project> {
  const response = await responsePromise
  const projectResponse = apiHelpers.extractData(response)
  return transformToProject(projectResponse, [])
}

/**
 * 새로운 프로젝트를 생성합니다.
 * @param data - 프로젝트 생성 데이터
 * @returns 생성된 프로젝트 정보 (기본 정보만, 멤버 정보 없음)
 */
export async function createProject(
  data: CreateProjectRequest,
): Promise<Project> {
  return extractProject(
    authApi.post('projects', { json: data }).json<CreateProjectApiResponse>(),
  )
}

/**
 * 프로젝트 상세 정보를 조회합니다.
 * @param projectId - 프로젝트 ID
 * @returns 프로젝트 상세 정보 (기본 정보만, 멤버 정보 없음)
 */
export async function getProject(projectId: number): Promise<Project> {
  return extractProject(
    authApi.get(`projects/${projectId}`).json<ProjectDetailApiResponse>(),
  )
}

/**
 * 프로젝트 정보를 수정합니다.
 * @param projectId - 프로젝트 ID
 * @param data - 수정할 프로젝트 데이터
 * @returns 수정된 프로젝트 정보 (기본 정보만, 멤버 정보 없음)
 */
export async function updateProject(
  projectId: number,
  data: { projectName?: string; description?: string },
): Promise<Project> {
  return extractProject(
    authApi
      .patch(`projects/${projectId}`, { json: data })
      .json<ProjectDetailApiResponse>(),
  )
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

/**
 * 프로젝트 멤버 목록을 조회합니다.
 * @param projectId - 프로젝트 ID
 * @returns 멤버 목록
 */
export async function getProjectMembers(
  projectId: number,
): Promise<ProjectMember[]> {
  const response = await authApi
    .get(`projects/${projectId}/members`)
    .json<ProjectMembersApiResponse>()

  return apiHelpers.extractData(response)
}
