import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { handleFileOperationError } from '@/shared/lib/error-handler'
import { createFile, deleteFile, moveFile } from '../api/file-operations'

export const useFileOperations = (projectId: string) => {
  const [isLoading, setIsLoading] = useState(false)

  const executeFileOperation = useCallback(
    async (operation: () => Promise<{ message: string }>) => {
      if (isLoading) {
        toast.warning('Another operation is in progress.')
        return
      }

      try {
        setIsLoading(true)
        const result = await operation()
        toast.success(result.message)
      } catch (error) {
        handleFileOperationError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const executeCreateFile = useCallback(
    async (targetPath: string, fileName: string) => {
      const filePath = `${targetPath === '/' ? '' : targetPath}/${fileName}`
      await executeFileOperation(() =>
        createFile(projectId, { path: filePath, type: 'file' }),
      )
    },
    [projectId, executeFileOperation],
  )

  const executeCreateFolder = useCallback(
    async (targetPath: string, folderName: string) => {
      const folderPath = `${targetPath === '/' ? '' : targetPath}/${folderName}`
      await executeFileOperation(() =>
        createFile(projectId, { path: folderPath, type: 'folder' }),
      )
    },
    [projectId, executeFileOperation],
  )

  const executeDeleteFile = useCallback(
    async (filePath: string) => {
      await executeFileOperation(() => deleteFile(projectId, filePath))
    },
    [projectId, executeFileOperation],
  )

  const executeFileRename = useCallback(
    async (currentPath: string, newName: string) => {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
      const newPath = `${parentPath}/${newName}`

      if (currentPath === newPath) {
        return
      }

      await executeFileOperation(() =>
        moveFile(projectId, { fromPath: currentPath, toPath: newPath }),
      )
    },
    [projectId, executeFileOperation],
  )

  // 고유한 파일 경로 생성 헬퍼 함수
  const generateUniquePath = useCallback(
    (basePath: string, originalFileName: string, counter = 1): string => {
      const lastDotIndex = originalFileName.lastIndexOf('.')
      const nameWithoutExt =
        lastDotIndex > 0
          ? originalFileName.substring(0, lastDotIndex)
          : originalFileName
      const extension =
        lastDotIndex > 0 ? originalFileName.substring(lastDotIndex) : ''
      const newFileName = `${nameWithoutExt} (${counter})${extension}`
      return `${basePath}/${newFileName}`
    },
    [],
  )

  // 파일 이동 재시도 로직
  const retryFileMoveWithUniqueName = useCallback(
    async (fromPath: string, toPath: string, fileName: string) => {
      let attemptCount = 1
      let uniquePath = generateUniquePath(toPath, fileName, attemptCount)

      while (attemptCount <= 5) {
        try {
          await executeFileOperation(() =>
            moveFile(projectId, { fromPath, toPath: uniquePath }),
          )
          toast.success(
            `File moved to "${uniquePath}" (renamed to avoid conflict)`,
          )
          return
        } catch (retryError) {
          if (
            retryError instanceof Error &&
            retryError.message.includes('already exists')
          ) {
            attemptCount++
            uniquePath = generateUniquePath(toPath, fileName, attemptCount)
          } else {
            throw retryError
          }
        }
      }

      // 모든 시도가 실패한 경우
      toast.error(
        `Unable to move file. Multiple files with similar names already exist at "${toPath}". Please choose a different location.`,
      )
    },
    [projectId, executeFileOperation, generateUniquePath],
  )

  const executeFileMove = useCallback(
    async (fromPath: string, toPath: string) => {
      const fileName = fromPath.substring(fromPath.lastIndexOf('/') + 1)
      const finalToPath = toPath.endsWith('/')
        ? `${toPath}${fileName}`
        : `${toPath}/${fileName}`

      if (fromPath === finalToPath) return

      try {
        await executeFileOperation(() =>
          moveFile(projectId, { fromPath, toPath: finalToPath }),
        )
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          await retryFileMoveWithUniqueName(fromPath, toPath, fileName)
        } else {
          handleFileOperationError(error)
        }
      }
    },
    [projectId, executeFileOperation, retryFileMoveWithUniqueName],
  )

  return {
    isLoading,
    executeCreateFile,
    executeCreateFolder,
    executeDeleteFile,
    executeFileRename,
    executeFileMove,
  }
}
