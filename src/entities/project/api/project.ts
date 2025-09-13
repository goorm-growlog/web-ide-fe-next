// 프로젝트 엔티티 API 클라이언트 - 순수 CRUD 작업만 담당

import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type { CreateProjectData, Project, ProjectMember } from '../model/types'

// API 요청/응답 스키마 타입들
export interface CreateProjectRequest {
  projectName: string
  description: string
  imageId: number
}

export interface UpdateProjectRequest {
  projectName?: string
  description?: string
}

export interface ProjectMemberDto {
  userId: number
  name: string
  email: string
  profileImageUrl?: string
  role: 'OWNER' | 'READ' | 'WRITE'
}

export interface ProjectResponseDto {
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

// 공통 API 응답 래퍼 타입들
type ProjectListResponse = ApiResponse<ProjectResponseDto[]>
type ProjectDetailResponse = ApiResponse<ProjectResponseDto>
type ProjectMembersResponse = ApiResponse<ProjectMemberDto[]>
type ProjectActionResponse = ApiResponse<ProjectResponseDto>
type ProjectDeleteResponse = ApiResponse<string>

/**
 * ProjectResponseDto를 Project 타입으로 변환합니다.
 */
export function transformToProject(dto: ProjectResponseDto): Project {
  return {
    ...dto,
    memberProfiles: [], // 기본값으로 빈 배열 설정
    myRole: dto.myRole as Project['myRole'],
  }
}

/**
 * ProjectMemberDto를 ProjectMember 타입으로 변환합니다.
 */
export function transformToProjectMember(dto: ProjectMemberDto): ProjectMember {
  return {
    userId: dto.userId,
    name: dto.name,
    email: dto.email,
    ...(dto.profileImageUrl && { profileImageUrl: dto.profileImageUrl }),
    role: dto.role,
  }
}

/**
 * 프로젝트 목록을 조회합니다. (순수 CRUD)
 */
export async function getProjects(type?: 'own' | 'joined'): Promise<Project[]> {
  const searchParams = type ? { type } : {}

  const response = await authApi
    .get('/projects', { searchParams })
    .json<ProjectListResponse>()

  const projectResponses = apiHelpers.extractData(response)
  return projectResponses.map(transformToProject)
}

/**
 * 프로젝트 상세 정보를 조회합니다. (순수 CRUD)
 */
export async function getProject(projectId: number): Promise<Project> {
  const response = await authApi
    .get(`/projects/${projectId}`)
    .json<ProjectDetailResponse>()

  const projectResponse = apiHelpers.extractData(response)
  return transformToProject(projectResponse)
}

/**
 * 새로운 프로젝트를 생성합니다. (순수 CRUD)
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  const requestData: CreateProjectRequest = {
    projectName: data.projectName,
    description: data.description || '',
    imageId: 1, // Java 17 이미지 ID로 변경
  }

  const response = await authApi
    .post('/projects', { json: requestData })
    .json<ProjectActionResponse>()

  const projectResponse = apiHelpers.extractData(response)
  return transformToProject(projectResponse)
}

/**
 * 프로젝트 멤버 목록을 조회합니다. (순수 CRUD)
 */
export async function getProjectMembers(
  projectId: number,
): Promise<ProjectMember[]> {
  const response = await authApi
    .get(`/projects/${projectId}/members`)
    .json<ProjectMembersResponse>()

  const memberDtos = apiHelpers.extractData(response)
  return memberDtos.map(transformToProjectMember)
}

/**
 * 프로젝트 정보를 수정합니다. (순수 CRUD)
 */
export async function updateProject(
  projectId: number,
  data: Partial<CreateProjectData>,
): Promise<Project> {
  const requestData: UpdateProjectRequest = {
    ...(data.projectName && { projectName: data.projectName }),
    ...(data.description !== undefined && { description: data.description }),
  }

  const response = await authApi
    .patch(`/projects/${projectId}`, { json: requestData })
    .json<ProjectActionResponse>()

  const projectResponse = apiHelpers.extractData(response)
  return transformToProject(projectResponse)
}

/**
 * 프로젝트를 삭제합니다. (순수 CRUD)
 */
export async function deleteProject(projectId: number): Promise<string> {
  const response = await authApi
    .delete(`/projects/${projectId}`)
    .json<ProjectDeleteResponse>()

  return apiHelpers.extractData(response)
}

/**
 * 프로젝트를 비활성화합니다.
 */
export async function inactivateProject(projectId: number): Promise<string> {
  const response = await authApi
    .patch(`/projects/${projectId}/inactivate`)
    .json<ProjectDeleteResponse>()

  return apiHelpers.extractData(response)
}
