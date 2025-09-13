import type { ItemInstance } from '@headless-tree/core'
import { type RefObject, useCallback } from 'react'
import { useFileOperations } from '@/features/file-explorer/lib/file-operations'
import type {
  FileActionType,
  FileNode,
} from '@/features/file-explorer/types/client'
import type { FileCreateDialogRef } from '@/features/file-explorer/ui/file-create-dialog'

/**
 * 다이얼로그 액션 인터페이스
 * 파일 및 폴더 생성 기능을 제공
 */
interface DialogActions {
  readonly createFile: (targetPath: string, fileName: string) => void
  readonly createFolder: (targetPath: string, folderName: string) => void
}

/**
 * 파일 액션 핸들러 인터페이스
 * 컨텍스트 메뉴 액션과 다이얼로그 액션을 포함
 */
export interface FileActionHandlers {
  readonly contextMenuAction: (
    action: FileActionType,
    item: ItemInstance<FileNode> | null,
  ) => void
  readonly dialogActions: DialogActions
}

/**
 * 파일 액션을 처리하는 커스텀 훅
 * 컨텍스트 메뉴 액션과 다이얼로그 액션을 제공
 *
 * @param rootId - 루트 노드의 ID
 * @param dialogRef - 파일 생성 다이얼로그의 참조
 * @returns 파일 액션 핸들러들
 */
export const useFileActions = (
  rootId: string,
  dialogRef?: RefObject<FileCreateDialogRef | null>,
): FileActionHandlers => {
  const {
    executeCopyPath,
    executeDeleteFile,
    executeCreateFile,
    executeCreateFolder,
  } = useFileOperations()

  /**
   * 컨텍스트 메뉴에서 선택된 액션을 처리
   * 각 액션 타입에 따라 적절한 작업을 수행
   */
  const contextMenuAction = useCallback(
    (action: FileActionType, item: ItemInstance<FileNode> | null) => {
      // 루트 아이템인 경우 처리
      if (item === null) {
        switch (action) {
          case 'newFile':
            dialogRef?.current?.openAsFile(rootId)
            break
          case 'newFolder':
            dialogRef?.current?.openAsFolder(rootId)
            break
          case 'copyPath':
            void executeCopyPath(rootId)
            break
          // 루트 아이템에서는 delete, rename 불가
          case 'delete':
          case 'rename':
            break
        }
        return
      }

      // 대상 경로를 결정하는 헬퍼 함수
      const getTargetPath = (itemInstance: ItemInstance<FileNode>) =>
        itemInstance.isFolder()
          ? itemInstance.getId()
          : itemInstance.getParent()?.getId() || rootId

      switch (action) {
        case 'newFile': {
          if (item.isFolder()) item.expand()
          const targetPath = getTargetPath(item)
          dialogRef?.current?.openAsFile(targetPath)
          break
        }
        case 'newFolder': {
          if (item.isFolder()) item.expand()
          const targetPath = getTargetPath(item)
          dialogRef?.current?.openAsFolder(targetPath)
          break
        }
        case 'copyPath':
          void executeCopyPath(item.getId())
          break
        case 'delete':
          executeDeleteFile(item.getId())
          break
        case 'rename':
          item.startRenaming()
          break
      }
    },
    [executeCopyPath, executeDeleteFile, dialogRef, rootId],
  )

  return {
    contextMenuAction,
    dialogActions: {
      createFile: executeCreateFile,
      createFolder: executeCreateFolder,
    },
  }
}
