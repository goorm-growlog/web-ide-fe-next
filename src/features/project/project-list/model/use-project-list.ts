'use client'

import useSWR from 'swr'
import type { Project } from '@/entities/project'
import { getEnrichedProjectsByType } from '@/entities/project'

// 이 훅의 반환 값에만 사용되므로, 타입을 지역적으로 정의합니다.
interface ProjectListData {
  hostProjects: Project[]
  invitedProjects: Project[]
  totalHost: number
  totalInvited: number
}

/**
 * 프로젝트 목록을 조회합니다. (FSD 원칙 - hooks에서 비즈니스 로직 처리)
 * 전역 SWR 설정을 활용하여 일관성 있는 캐싱과 에러 처리
 */
export function useProjectList() {
  const { data, error, isLoading, mutate } = useSWR(
    'projects/enriched?maxHost=3&maxInvited=4', // URL 기반으로 표준화
    async (): Promise<ProjectListData> => {
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
    // 전역 설정을 사용하므로 개별 설정 제거
  )

  return {
    hostProjects: data?.hostProjects ?? [],
    invitedProjects: data?.invitedProjects ?? [],
    totalHost: data?.totalHost ?? 0,
    totalInvited: data?.totalInvited ?? 0,
    isLoading,
    error: error?.message || null, // 일관된 에러 처리
    refetch: mutate,
  }
}
