'use client'

import { useCallback, useState } from 'react'
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

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setProject(null)
  }, [])

  const handleSuccess = useCallback(() => {
    closeDialog()
    // TODO: 성공 알림 및 목록 새로고침
  }, [closeDialog])

  return {
    project,
    isOpen,
    openDialog,
    closeDialog: setIsOpen,
    handleSuccess,
  }
}
