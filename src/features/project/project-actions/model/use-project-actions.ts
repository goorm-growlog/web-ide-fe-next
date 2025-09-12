'use client'

import { useCallback } from 'react'
import type { Project } from '@/entities/project'

/**
 * 프로젝트 액션을 처리하는 훅 (Features 레이어)
 * 실제 비즈니스 로직과 API 호출을 담당
 */
export function useProjectActions() {
  const handleEditProject = useCallback((project: Project) => {
    console.log('Edit project:', project.projectName)
    // TODO: EditProjectDialog 구현
    // TODO: API 호출 및 상태 업데이트
  }, [])

  const handleInactivateProject = useCallback((project: Project) => {
    console.log('Inactivate project:', project.projectName)
    // TODO: Inactivate 확인 다이얼로그 구현
    // TODO: API 호출 및 상태 업데이트
  }, [])

  const handleDeleteProject = useCallback((project: Project) => {
    console.log('Delete project:', project.projectName)
    // TODO: Delete 확인 다이얼로그 구현
    // TODO: API 호출 및 상태 업데이트
  }, [])

  return {
    handleEditProject,
    handleInactivateProject,
    handleDeleteProject,
  }
}
