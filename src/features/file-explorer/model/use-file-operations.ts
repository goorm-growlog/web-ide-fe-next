import { useCallback } from 'react'
import { handleNewFile as createFileHandler } from '@/features/file-explorer/lib/new-file-handler'
import { handleNewFolder as createFolderHandler } from '@/features/file-explorer/lib/new-folder-handler'

export interface FileOperations {
  readonly createFile: (targetPath: string, fileName: string) => void
  readonly createFolder: (targetPath: string, folderName: string) => void
  readonly deleteItem: (itemPath: string) => void
  readonly copyPath: (itemPath: string) => Promise<void>
}

export const useFileOperations = (): FileOperations => {
  const createFile = useCallback((targetPath: string, fileName: string) => {
    createFileHandler(targetPath, fileName)
  }, [])

  const createFolder = useCallback((targetPath: string, folderName: string) => {
    createFolderHandler(targetPath, folderName)
  }, [])

  const deleteItem = useCallback((itemPath: string) => {
    console.log('Delete:', itemPath)
  }, [])

  const copyPath = useCallback(async (itemPath: string) => {
    await navigator.clipboard.writeText(itemPath)
  }, [])

  return {
    createFile,
    createFolder,
    deleteItem,
    copyPath,
  }
}
