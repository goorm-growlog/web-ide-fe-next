'use client'

import { useState } from 'react'
import { createProject as createProjectApi } from '@/entities/project/api/project'
import type { CreateProjectData } from '@/entities/project/model/types'
import { handleProjectError } from '@/shared/lib/error-handler'

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
      handleProjectError(err)
      return { success: false, error: 'Failed to create project' }
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
