'use client'

import { useState } from 'react'
import { createProject as createProjectApi } from '@/features/project/api/project-api'
import type { CreateProjectData } from '@/features/project/model/types'

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: CreateProjectData) => {
    setIsLoading(true)
    setError(null)

    try {
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
