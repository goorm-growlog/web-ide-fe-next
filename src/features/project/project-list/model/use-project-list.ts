'use client'

import { useCallback, useEffect, useState } from 'react'
import type { GetProjectsResponse } from '@/features/project/model/api'
import type { Project } from '@/features/project/model/types'

// 임시 더미 데이터
const generateMockProject = (
  id: string,
  name: string,
  isOwner: boolean,
  status: 'active' | 'inactive' = 'active',
): Project => ({
  id,
  name,
  description: 'Java 기반 테스트용',
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner' as const,
    avatar: '',
  },
  members: [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner' as const,
      avatar: '',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'member' as const,
      avatar: '',
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'member' as const,
      avatar: '',
    },
    {
      id: 'user-4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'member' as const,
      avatar: '',
    },
  ],
  memberCount: 6,
  status,
  isOwner,
  isInvited: !isOwner,
})

const mockData: GetProjectsResponse = {
  hostProjects: [
    generateMockProject('1', 'webide-project', true, 'active'),
    generateMockProject('2', 'webide-project', true, 'inactive'),
    generateMockProject('3', 'my-awesome-app', true, 'active'),
  ],
  invitedProjects: [
    generateMockProject('4', 'webide-project', false, 'active'),
    generateMockProject('5', 'webide-project', false, 'inactive'),
    generateMockProject('6', 'team-project', false, 'active'),
    generateMockProject('7', 'shared-workspace', false, 'inactive'),
  ],
  totalHost: 20,
  totalInvited: 20,
}

export function useProjectList() {
  const [data, setData] = useState<GetProjectsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 임시 delay 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500))

      setData(mockData)
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
    // 직접 fetchProjects 함수를 호출하여 데이터 재요청
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
