import type { ItemInstance } from '@headless-tree/core'
import { type RefObject, useCallback } from 'react'
import { useFileOperations } from '@/entities/file-tree/hooks/use-file-operations'
import type { FileNode } from '@/entities/file-tree/model/types'
import type { FileActionType } from '@/features/file-explorer/types/client'
import type { FileCreateDialogRef } from '@/features/file-explorer/ui/file-create-dialog'
import { copyToClipboard } from '@/shared/lib/clipboard-utils'
import { logger } from '@/shared/lib/logger'

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
  readonly contextMenu: (
    action: FileActionType,
    item: ItemInstance<FileNode> | null,
  ) => void
  readonly dialogActions: DialogActions
}

/**
 * 파일 액션을 처리하는 커스텀 훅 (성능 최적화 버전)
 * 컨텍스트 메뉴 액션과 다이얼로그 액션을 제공
 *
 * @param rootId - 루트 노드의 ID
 * @param projectId - 프로젝트 ID
 * @param dialogRef - 파일 생성 다이얼로그의 참조
 * @returns 파일 액션 핸들러들
 */
export const useFileActions = (
  rootId: string,
  projectId: string,
  dialogRef?: RefObject<FileCreateDialogRef | null>,
): FileActionHandlers => {
  const { executeDeleteFile, executeCreateFile, executeCreateFolder } =
    useFileOperations(projectId)

  /**
   * 대상 경로를 결정하는 헬퍼 함수 (공통 로직만 추출)
   */
  const resolveTargetPath = useCallback(
    (item: ItemInstance<FileNode> | null): string => {
      if (item === null) return rootId
      const isTargetFolder = item.getItemData().type === 'folder'
      return isTargetFolder ? item.getId() : item.getParent()?.getId() || rootId
    },
    [rootId],
  )

  /**
   * 루트 아이템 처리
   */
  const handleRootItem = useCallback(
    (action: FileActionType) => {
      const targetPath = resolveTargetPath(null)

      switch (action) {
        case 'newFile':
          dialogRef?.current?.openAsFile(targetPath)
          break
        case 'newFolder':
          dialogRef?.current?.openAsFolder(targetPath)
          break
        case 'copyPath':
          void copyToClipboard(targetPath)
          break
        // 루트 아이템에서는 delete, rename 불가
        case 'delete':
        case 'rename':
          break
      }
    },
    [resolveTargetPath, dialogRef],
  )

  /**
   * 일반 아이템 처리
   */
  const handleItem = useCallback(
    (action: FileActionType, item: ItemInstance<FileNode>) => {
      const targetPath = resolveTargetPath(item)
      const isItemFolder = item.getItemData().type === 'folder'

      switch (action) {
        case 'newFile':
          if (isItemFolder) item.expand()
          dialogRef?.current?.openAsFile(targetPath)
          break
        case 'newFolder':
          if (isItemFolder) item.expand()
          dialogRef?.current?.openAsFolder(targetPath)
          break
        case 'copyPath':
          void copyToClipboard(item.getId())
          break
        case 'delete':
          executeDeleteFile(item.getId())
          break
        case 'rename':
          if (isItemFolder && !item.isExpanded()) {
            item.expand()
          }
          item.startRenaming()
          break
      }
    },
    [resolveTargetPath, executeDeleteFile, dialogRef],
  )

  /**
   * 컨텍스트 메뉴에서 선택된 액션을 처리
   * 각 액션 타입에 따라 적절한 작업을 수행
   */
  const contextMenu = useCallback(
    (action: FileActionType, item: ItemInstance<FileNode> | null) => {
      logger.debug('Context menu action:', action, 'item:', item?.getId())
      if (item === null) {
        handleRootItem(action)
      } else {
        handleItem(action, item)
      }
    },
    [handleRootItem, handleItem],
  )

  return {
    contextMenu,
    dialogActions: {
      createFile: executeCreateFile,
      createFolder: executeCreateFolder,
    },
  }
}
