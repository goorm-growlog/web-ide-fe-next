'use client'

import useSWR from 'swr'
import { getProjects } from '@/features/project/api/project-api'
import type { GetProjectsResponse } from '@/features/project/model/api'

/**
 * 단순하고 효과적인 프로젝트 목록 훅
 * SWR 캐싱만 활용하여 적당한 최적화
 */
export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'project-list',
    async (): Promise<GetProjectsResponse> => {
      // 병렬로 내 프로젝트와 참여 중인 프로젝트를 가져옴 (멤버 정보 포함)
      const [hostProjects, invitedProjects] = await Promise.all([
        getProjects('own'),
        getProjects('joined'),
      ])

      return {
        hostProjects,
        invitedProjects,
        totalHost: hostProjects.length,
        totalInvited: invitedProjects.length,
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30초 캐싱으로 늘림 (기존 5초 → 30초)
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
