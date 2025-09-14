'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { inactivateProject } from '@/entities/project/api/project'
import type { Project } from '@/entities/project/model/types'

/**
 * 프로젝트 비활성화 액션을 처리하는 훅 (Features 레이어)
 * 단일 책임: 프로젝트 비활성화 다이얼로그 상태 및 비활성화 로직만 담당
 */
export function useInactivateProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openDialog = useCallback((project: Project) => {
    setProject(project)
    setIsOpen(true)
  }, [])

  const confirmInactivate = useCallback(async () => {
    if (!project) return

    setIsLoading(true)
    try {
      await inactivateProject(project.projectId)

      // 성공 알림
      toast.success(`Project "${project.projectName}" has been inactivated.`)

      // 간단한 페이지 새로고침
      window.location.reload()
    } catch (error) {
      // 에러 알림
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to inactivate project'
      toast.error(`Inactivation failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [project])

  return {
    project,
    isOpen,
    isLoading,
    openDialog,
    closeDialog: setIsOpen,
    confirmInactivate,
  }
}
