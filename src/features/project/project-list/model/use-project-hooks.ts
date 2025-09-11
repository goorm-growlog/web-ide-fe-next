'use client'

import useSWR from 'swr'
import { getProjects } from '@/entities/project'

/**
 * 내가 만든 프로젝트 목록을 조회합니다. (모달용)
 */
export function useOwnProjects() {
  const { data, error, isLoading, mutate } = useSWR('projects/own', () =>
    getProjects('own'),
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
 */
export function useJoinedProjects() {
  const { data, error, isLoading, mutate } = useSWR('projects/joined', () =>
    getProjects('joined'),
  )

  return {
    projects: data ?? [],
    isLoading,
    error: error?.message || null,
    refetch: mutate,
  }
}
