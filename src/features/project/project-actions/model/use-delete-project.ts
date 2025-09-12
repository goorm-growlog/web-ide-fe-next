'use client'

import { useCallback, useState } from 'react'
import type { Project } from '@/entities/project'
import { deleteProject } from '@/entities/project'

/**
 * 프로젝트 삭제 액션을 처리하는 훅 (Features 레이어)
 * 단일 책임: 프로젝트 삭제 다이얼로그 상태 및 삭제 로직만 담당
 */
export function useDeleteProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openDialog = useCallback((project: Project) => {
    setProject(project)
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setProject(null)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!project) return

    setIsLoading(true)
    try {
      await deleteProject(project.projectId)
      closeDialog()
      // TODO: 성공 알림 및 목록 새로고침
    } catch (error) {
      console.error('Failed to delete project:', error)
      // TODO: 에러 알림
    } finally {
      setIsLoading(false)
    }
  }, [project, closeDialog])

  return {
    project,
    isOpen,
    isLoading,
    openDialog,
    closeDialog: setIsOpen,
    confirmDelete,
  }
}
