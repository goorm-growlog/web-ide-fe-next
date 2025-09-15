'use client'

import useSWR from 'swr'
import { getEnrichedProjectsByType } from '@/entities/project/model/project-service'

/**
 * 모든 프로젝트 정보를 한 번에 조회하는 통합 훅
 * API 호출을 하나로 통합하여 세션 중복 호출을 방지
 */
export function useUnifiedProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/projects/enriched/all',
    async () => {
      const result = await getEnrichedProjectsByType()
      return result
    },
  )

  const hostProjects = data?.hostProjects ?? []
  const invitedProjects = data?.invitedProjects ?? []

  // 정렬된 프로젝트 반환 (최근 수정일순)
  const sortedHostProjects = [...hostProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const sortedInvitedProjects = [...invitedProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return {
    // 개별 프로젝트 배열
    ownProjects: sortedHostProjects,
    joinedProjects: sortedInvitedProjects,

    // 로딩 상태
    isLoading,
    error: error?.message || null,

    // 리페치 함수
    refetch: mutate,
  }
}
