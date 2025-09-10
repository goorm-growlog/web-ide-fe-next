// 프로젝트 엔티티 API 클라이언트 - 순수 CRUD 작업만 담당

import { apiHelpers, authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type { CreateProjectData, Project, ProjectMember } from '../model/types'

// API 스키마 타입들
export interface CreateProjectRequest {
  projectName: string
  description?: string
  imageId?: number
}

export interface MemberDto {
  userId: number
  name: string
  email: string
  profileImageUrl?: string
  role: 'OWNER' | 'READ' | 'WRITE'
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
export type ProjectMembersApiResponse = ApiResponse<MemberDto[]>

/**
 * ProjectResponse를 Project 타입으로 변환합니다.
 */
function transformToProject(projectResponse: ProjectResponse): Project {
  return {
    ...projectResponse,
    memberProfiles: [], // 기본값으로 빈 배열 설정
  }
}

/**
 * MemberDto를 ProjectMember 타입으로 변환합니다.
 */
function transformToProjectMember(dto: MemberDto): ProjectMember {
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
    .get('projects', { searchParams })
    .json<ProjectListApiResponse>()

  const projectResponses = apiHelpers.extractData(response)
  return projectResponses.map(transformToProject)
}

/**
 * 프로젝트 상세 정보를 조회합니다. (순수 CRUD)
 */
export async function getProject(projectId: number): Promise<Project> {
  const response = await authApi
    .get(`projects/${projectId}`)
    .json<ProjectDetailApiResponse>()

  const projectResponse = apiHelpers.extractData(response)
  return transformToProject(projectResponse)
}

/**
 * 새로운 프로젝트를 생성합니다. (순수 CRUD)
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  const requestData: CreateProjectRequest = {
    projectName: data.projectName,
    ...(data.description && { description: data.description }),
    ...(data.imageId && { imageId: data.imageId }),
  }

  const response = await authApi
    .post('projects', { json: requestData })
    .json<CreateProjectApiResponse>()

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
    .get(`projects/${projectId}/members`)
    .json<ProjectMembersApiResponse>()

  const memberDtos = apiHelpers.extractData(response)
  return memberDtos.map(transformToProjectMember)
}
