'use client'

import { useCallback, useEffect, useState } from 'react'
import { getProjects } from '@/features/project/api/project-api'
import type { GetProjectsResponse } from '@/features/project/model/api'

export function useProjectList() {
  const [data, setData] = useState<GetProjectsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 병렬로 내 프로젝트와 참여 중인 프로젝트를 가져옴
      const [hostProjects, invitedProjects] = await Promise.all([
        getProjects('own'), // 내가 만든 프로젝트
        getProjects('joined'), // 참여 중인 프로젝트
      ])

      setData({
        hostProjects,
        invitedProjects,
        totalHost: hostProjects.length,
        totalInvited: invitedProjects.length,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch projects'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const refetch = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  return {
    hostProjects: data?.hostProjects ?? [],
    invitedProjects: data?.invitedProjects ?? [],
    totalHost: data?.totalHost ?? 0,
    totalInvited: data?.totalInvited ?? 0,
    isLoading,
    error,
    refetch,
  }
}
