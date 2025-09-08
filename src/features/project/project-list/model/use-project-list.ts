'use client'

import useSWR from 'swr'
import { getProjects } from '@/features/project/api/project-api'
import type { GetProjectsResponse } from '@/features/project/model/api'

/**
 * 프로젝트 목록을 조회합니다.
 * 전체 개수 조회 + 표시할 프로젝트만 상세 정보 조회
 */
export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'project-list',
    async (): Promise<GetProjectsResponse> => {
      // 1단계: 전체 개수 파악 (빠른 조회)
      const [allHostProjects, allInvitedProjects] = await Promise.all([
        getProjects('own'),
        getProjects('joined'),
      ])

      // 2단계: 표시할 프로젝트만 상세 정보 조회 (멤버 프로필 이미지 포함)
      const [detailedHostProjects, detailedInvitedProjects] = await Promise.all(
        [
          getProjects('own', true), // 상세 정보 포함
          getProjects('joined', true), // 상세 정보 포함
        ],
      )

      return {
        hostProjects: detailedHostProjects.slice(0, 3), // 표시할 3개 (프로필 이미지 포함)
        invitedProjects: detailedInvitedProjects.slice(0, 4), // 표시할 4개 (프로필 이미지 포함)
        totalHost: allHostProjects.length, // 전체 개수
        totalInvited: allInvitedProjects.length, // 전체 개수
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
