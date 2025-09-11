// 프로젝트 엔티티 비즈니스 로직 훅

import useSWR from 'swr'
import { getProject, getProjectMembers, getProjects } from '../api/project'

/**
 * 프로젝트 목록 조회 훅
 */
export function useProjects(type?: 'own' | 'joined') {
  const { data, error, isLoading, mutate } = useSWR(
    type ? `projects-${type}` : 'projects',
    () => getProjects(type),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30초 캐싱
    },
  )

  return {
    projects: data ?? [],
    isLoading,
    error: error?.message,
    refetch: mutate,
  }
}

/**
 * 단일 프로젝트 조회 훅
 */
export function useProject(projectId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `project-${projectId}` : null,
    () => (projectId ? getProject(projectId) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  )

  return {
    project: data,
    isLoading,
    error: error?.message,
    refetch: mutate,
  }
}

/**
 * 프로젝트 멤버 조회 훅
 */
export function useProjectMembers(projectId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `project-members-${projectId}` : null,
    () => (projectId ? getProjectMembers(projectId) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  )

  return {
    members: data ?? [],
    isLoading,
    error: error?.message,
    refetch: mutate,
  }
}
