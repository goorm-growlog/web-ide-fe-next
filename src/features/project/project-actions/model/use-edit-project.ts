'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { Project } from '@/entities/project'

/**
 * 프로젝트 편집 액션을 처리하는 훅 (Features 레이어)
 * 단일 책임: 프로젝트 편집 다이얼로그 상태 관리만 담당
 */
export function useEditProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = useCallback((project: Project) => {
    setProject(project)
    setIsOpen(true)
  }, [])

  const handleSuccess = useCallback(async () => {
    if (!project) return

    // 성공 알림
    toast.success(
      `Project "${project.projectName}" has been updated successfully.`,
    )

    // 간단한 페이지 새로고침
    window.location.reload()
  }, [project])

  return {
    project,
    isOpen,
    openDialog,
    closeDialog: setIsOpen,
    handleSuccess,
  }
}
