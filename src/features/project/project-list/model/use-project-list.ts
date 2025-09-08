'use client'

import useSWR from 'swr'
import { getProjects } from '@/features/project/api/project-api'
import type { GetProjectsResponse } from '@/features/project/model/api'

export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'project-list',
    async (): Promise<GetProjectsResponse> => {
      // 병렬로 내 프로젝트와 참여 중인 프로젝트를 가져옴
      const [hostProjects, invitedProjects] = await Promise.all([
        getProjects('own'), // 내가 만든 프로젝트
        getProjects('joined'), // 참여 중인 프로젝트
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
      dedupingInterval: 5000, // 5초 내 중복 요청 방지
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
