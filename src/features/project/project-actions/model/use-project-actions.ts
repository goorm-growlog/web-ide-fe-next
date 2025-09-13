'use client'

import { useDeleteProject } from '@/features/project/project-actions/model/use-delete-project'
import { useEditProject } from '@/features/project/project-actions/model/use-edit-project'
import { useInactivateProject } from '@/features/project/project-actions/model/use-inactivate-project'

/**
 * 프로젝트 액션을 처리하는 메인 훅 (Features 레이어)
 * 컴포지션 패턴: 각각의 단일 책임 훅들을 조합
 * FSD 원칙: 단방향 의존성, 단일 책임, 명확한 인터페이스
 */
export function useProjectActions() {
  const editDialog = useEditProject()
  const deleteDialog = useDeleteProject()
  const inactivateDialog = useInactivateProject()

  return {
    // 액션 핸들러들 - 메뉴에서 사용
    actions: {
      edit: editDialog.openDialog,
      delete: deleteDialog.openDialog,
      inactivate: inactivateDialog.openDialog,
    },

    // 다이얼로그 상태들 - ProjectDialogs 컴포넌트에서 사용
    dialogs: {
      edit: editDialog,
      delete: deleteDialog,
      inactivate: inactivateDialog,
    },
  }
}
