'use client'

import { EditProjectDialog } from '@/features/project/project-edit/ui/edit-project-dialog'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import type { useDeleteProject } from '../model/use-delete-project'
import type { useEditProject } from '../model/use-edit-project'
import type { useInactivateProject } from '../model/use-inactivate-project'

interface ProjectDialogsProps {
  editDialog: ReturnType<typeof useEditProject>
  deleteDialog: ReturnType<typeof useDeleteProject>
  inactivateDialog: ReturnType<typeof useInactivateProject>
}

/**
 * 프로젝트 액션 관련 모든 다이얼로그를 관리하는 컴포넌트
 * UI 레이어 - 단일 책임: 다이얼로그 렌더링만 담당
 */
export function ProjectDialogs({
  editDialog,
  deleteDialog,
  inactivateDialog,
}: ProjectDialogsProps) {
  return (
    <>
      {/* 편집 다이얼로그 */}
      {editDialog.project && (
        <EditProjectDialog
          project={editDialog.project}
          open={editDialog.isOpen}
          onOpenChange={editDialog.closeDialog}
          onSuccess={editDialog.handleSuccess}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.closeDialog}
        onConfirm={deleteDialog.confirmDelete}
        title="Delete Project"
        description={`Are you sure you want to delete ${deleteDialog.project?.projectName ?? 'this project'}?\nThis action cannot be undone and permanently remove all project data.`}
        confirmText={deleteDialog.isLoading ? 'Deleting...' : 'Delete Project'}
        {...(deleteDialog.project?.projectName && {
          targetName: deleteDialog.project.projectName,
        })}
        variant="destructive"
        isLoading={deleteDialog.isLoading}
      />

      {/* 비활성화 확인 다이얼로그 */}
      <ConfirmDialog
        open={inactivateDialog.isOpen}
        onOpenChange={inactivateDialog.closeDialog}
        onConfirm={inactivateDialog.confirmInactivate}
        title="Inactivate Project"
        description={`Are you sure you want to inactivate ${inactivateDialog.project?.projectName ?? 'this project'}?\nThis will make the project unavailable for collaboration until reactivated.`}
        confirmText={
          inactivateDialog.isLoading ? 'Inactivating...' : 'Inactivate Project'
        }
        {...(inactivateDialog.project?.projectName && {
          targetName: inactivateDialog.project.projectName,
        })}
        variant="warning"
        isLoading={inactivateDialog.isLoading}
      />
    </>
  )
}
