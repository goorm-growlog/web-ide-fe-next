'use client'

import { useState } from 'react'
import type { CreateProjectData } from '../../model/types'

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: CreateProjectData) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: API 호출 구현
      console.log('Creating project:', data)

      // 임시 delay 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 성공 시 로직
      return { success: true, projectId: `project_${Date.now()}` }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProject,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
