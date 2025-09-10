'use client'

import { useState } from 'react'
import type { CreateProjectData } from '@/entities/project'
import { createProject as createProjectApi } from '@/entities/project'

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: CreateProjectData) => {
    setIsLoading(true)
    setError(null)

    try {
      // FSD 원칙 - entities API 직접 사용
      const project = await createProjectApi(data)

      return {
        success: true,
        projectId: project.projectId.toString(),
        project,
      }
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
