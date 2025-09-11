'use client'

import useSWR from 'swr'
import { getEnrichedProjectsByType } from '@/entities/project'

/**
 * 내가 만든 프로젝트 목록을 조회합니다. (모달용)
 * 멤버 프로필 이미지 포함
 */
export function useOwnProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    'projects/enriched/own',
    async () => {
      const { hostProjects } = await getEnrichedProjectsByType()
      return hostProjects
    },
  )

  return {
    projects: data ?? [],
    isLoading,
    error: error?.message || null,
    refetch: mutate,
  }
}

/**
 * 참여 중인 프로젝트 목록을 조회합니다. (모달용)
 * 멤버 프로필 이미지 포함
 */
export function useJoinedProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    'projects/enriched/joined',
    async () => {
      const { invitedProjects } = await getEnrichedProjectsByType()
      return invitedProjects
    },
  )

  return {
    projects: data ?? [],
    isLoading,
    error: error?.message || null,
    refetch: mutate,
  }
}
