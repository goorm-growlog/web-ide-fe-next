'use client'

import useSWR from 'swr'
import type { GetProjectsResponse } from '@/features/project/model/api'
import { getEnrichedProjectsByType } from '@/features/project/model/project-service'

/**
 * 프로젝트 목록을 조회합니다.
 */
export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'project-list',
    async (): Promise<GetProjectsResponse> => {
      const { hostProjects, invitedProjects } =
        await getEnrichedProjectsByType()

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
