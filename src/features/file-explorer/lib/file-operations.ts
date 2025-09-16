import type { ItemInstance } from '@headless-tree/core'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { moveFile } from '@/entities/file-tree/api/file-operations'
import type { FileNode } from '@/entities/file-tree/model/types'
import { handleFileOperationError } from '@/shared/lib/error-handler'

export const useFileOperations = () => {
  const executeFileOperation = useCallback(
    async (operation: () => Promise<{ message: string }>) => {
      try {
        const result = await operation()
        toast.success(result.message)
      } catch (error) {
        handleFileOperationError(error)
      }
    },
    [],
  )

  const executeFileRename = useCallback(
    async (item: ItemInstance<FileNode>, newName: string) => {
      const currentPath = item.getId()
      const parentPath =
        currentPath.substring(0, currentPath.lastIndexOf('/')) || '/'
      const newPath = `${parentPath === '/' ? '' : parentPath}/${newName}`

      await executeFileOperation(() =>
        moveFile('', { fromPath: currentPath, toPath: newPath }),
      )
    },
    [executeFileOperation],
  )

  const executeFileMove = useCallback(
    async (
      items: ItemInstance<FileNode>[],
      target: { item: ItemInstance<FileNode> },
    ) => {
      const toPath = target.item.getId()
      const targetPath = target.item.isFolder()
        ? toPath
        : toPath.substring(0, toPath.lastIndexOf('/')) || '/'

      for (const item of items) {
        const fromPath = item.getId()
        if (fromPath) {
          await executeFileOperation(() =>
            moveFile('', { fromPath, toPath: targetPath }),
          )
        }
      }
    },
    [executeFileOperation],
  )

  return {
    executeFileRename,
    executeFileMove,
  }
}
