'use client'

import useSWR from 'swr'
import { getEnrichedProjectsByType, type Project } from '@/entities/project'

// 이 훅의 반환 값에만 사용되므로, 타입을 지역적으로 정의합니다.
interface GetProjectsResponse {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
}

/**
 * 프로젝트 목록을 조회합니다.
 */
export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'project-list',
    async (): Promise<GetProjectsResponse> => {
      const { hostProjects, invitedProjects } = await getEnrichedProjectsByType(
        {
          maxHostProjects: 3,
          maxInvitedProjects: 4,
        },
      )

      return {
        hostProjects,
        invitedProjects,
        totalHost: hostProjects.length,
        totalInvited: invitedProjects.length,
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30초 캐싱
    },
  )

  return {
    hostProjects: data?.hostProjects ?? [],
    invitedProjects: data?.invitedProjects ?? [],
    totalHost: data?.totalHost ?? 0,
    totalInvited: data?.totalInvited ?? 0,
    isLoading,
    error: error?.message,
    refetch: mutate,
  }
}
