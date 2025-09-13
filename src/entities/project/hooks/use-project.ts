// 프로젝트 엔티티 비즈니스 로직 훅

import useSWR from 'swr'
import { transformToProject, transformToProjectMember } from '../api/project'

/**
 * 프로젝트 목록 조회 훅 - 전역 fetcher 활용
 */
export function useProjects(type?: 'own' | 'joined') {
  const { data, error, isLoading, mutate } = useSWR(
    type ? `/projects?type=${type}` : '/projects',
    // fetcher는 전역 설정에서 자동으로 사용됨
  )

  // API 응답을 Project 타입으로 변환
  const projects = data ? data.map(transformToProject) : []

  return {
    projects,
    isLoading,
    error: error?.message || null, // 일관된 에러 처리
    refetch: mutate,
  }
}

/**
 * 단일 프로젝트 조회 훅 - 전역 fetcher 활용
 */
export function useProject(projectId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/projects/${projectId}` : null,
    // fetcher는 전역 설정에서 자동으로 사용됨
  )

  // API 응답을 Project 타입으로 변환
  const project = data ? transformToProject(data) : null

  return {
    project,
    isLoading,
    error: error?.message || null, // 일관된 에러 처리
    refetch: mutate,
  }
}

/**
 * 프로젝트 멤버 조회 훅 - 전역 fetcher 활용
 */
export function useProjectMembers(projectId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/projects/${projectId}/members` : null,
    // fetcher는 전역 설정에서 자동으로 사용됨
  )

  // API 응답을 ProjectMember 타입으로 변환
  const members = data ? data.map(transformToProjectMember) : []

  return {
    members,
    isLoading,
    error: error?.message || null, // 일관된 에러 처리
    refetch: mutate,
  }
}
