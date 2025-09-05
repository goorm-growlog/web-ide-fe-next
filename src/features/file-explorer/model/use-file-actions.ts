import type { ItemInstance } from '@headless-tree/core'
import { type RefObject, useCallback } from 'react'
import type {
  FileActionType,
  FileNode,
} from '@/features/file-explorer/model/types'
import type { FileCreateDialogRef } from '@/features/file-explorer/ui/file-create-dialog'
import { useFileOperations } from './use-file-operations'

interface DialogActions {
  readonly createFile: (targetPath: string, fileName: string) => void
  readonly createFolder: (targetPath: string, folderName: string) => void
}

export interface FileActionHandlers {
  readonly contextMenuAction: (
    action: FileActionType,
    item: ItemInstance<FileNode>,
  ) => void
  readonly dialogActions: DialogActions
}

export const useFileActions = (
  rootId: string,
  dialogRef?: RefObject<FileCreateDialogRef | null>,
): FileActionHandlers => {
  const { copyPath, deleteItem, createFile, createFolder } = useFileOperations()

  const contextMenuAction = useCallback(
    (action: FileActionType, item: ItemInstance<FileNode>) => {
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
          void copyPath(item.getId())
          break
        case 'delete':
          deleteItem(item.getId())
          break
        case 'rename':
          item.startRenaming()
          break
      }
    },
    [copyPath, deleteItem, dialogRef, rootId],
  )

  return {
    contextMenuAction,
    dialogActions: {
      createFile,
      createFolder,
    },
  }
}
