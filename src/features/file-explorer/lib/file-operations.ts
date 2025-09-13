import type { ItemInstance } from '@headless-tree/core'
import { FILE_EXPLORER_ERROR_MESSAGES } from '@/features/file-explorer/constants/error-constants'
import { FILE_EXPLORER_LOG_MESSAGES } from '@/features/file-explorer/constants/log-constants'
import { useFileTreeStore } from '@/features/file-explorer/stores/file-tree-store'
import type { FileNode } from '@/features/file-explorer/types/client'

/**
 * 파일 작업 인터페이스
 * 파일과 폴더의 생성, 삭제, 이름 변경, 드래그 앤 드롭 기능을 제공
 */
export interface FileOperations {
  readonly createFile: (targetPath: string, fileName: string) => void
  readonly createFolder: (targetPath: string, folderName: string) => void
  readonly deleteItem: (itemPath: string) => void
  readonly copyPath: (itemPath: string) => Promise<void>
  readonly handleRename: (item: ItemInstance<FileNode>, newName: string) => void
  readonly handleDrop: (
    items: ItemInstance<FileNode>[],
    target: { item: ItemInstance<FileNode> },
  ) => void
}

/**
 * 파일 작업을 제공하는 커스텀 훅
 * React 규칙을 준수하며 상태 관리 함수들을 제공
 */
export const useFileOperations = (): FileOperations => {
  const { addNode, removeNode, updateNode, setError } = useFileTreeStore()

  return {
    /**
     * 새 파일 생성
     * @param targetPath - 파일을 생성할 대상 경로
     * @param fileName - 생성할 파일명
     */
    createFile: (targetPath: string, fileName: string) => {
      // TODO: 서버 API 연동 필요
      const filePath = `${targetPath === '/' ? '' : targetPath}/${fileName}`
      const newNode = {
        id: filePath,
        name: fileName,
        path: filePath,
        isFolder: false,
      }

      addNode(filePath, newNode)
      console.debug(
        `${FILE_EXPLORER_LOG_MESSAGES.LOG_FILE_CREATED} ${filePath}`,
      )
    },

    /**
     * 새 폴더 생성
     * @param targetPath - 폴더를 생성할 대상 경로
     * @param folderName - 생성할 폴더명
     */
    createFolder: (targetPath: string, folderName: string) => {
      // TODO: 서버 API 연동 필요
      const folderPath = `${targetPath === '/' ? '' : targetPath}/${folderName}`
      const newFolder = {
        id: folderPath,
        name: folderName,
        path: folderPath,
        isFolder: true,
        children: [],
      }

      addNode(folderPath, newFolder)
      console.debug(
        `${FILE_EXPLORER_LOG_MESSAGES.LOG_FOLDER_CREATED} ${folderPath}`,
      )
    },

    /**
     * 파일 또는 폴더 삭제
     * @param itemPath - 삭제할 항목의 경로
     */
    deleteItem: (itemPath: string) => {
      // TODO: 서버 API 연동 필요
      removeNode(itemPath)
      console.debug(
        `${FILE_EXPLORER_LOG_MESSAGES.LOG_ITEM_DELETED} ${itemPath}`,
      )
    },

    /**
     * 경로를 클립보드에 복사
     * @param itemPath - 복사할 경로
     */
    copyPath: async (itemPath: string) => {
      try {
        await navigator.clipboard.writeText(itemPath)
        console.debug(
          `${FILE_EXPLORER_LOG_MESSAGES.LOG_PATH_COPIED} ${itemPath}`,
        )
      } catch (error) {
        console.error(
          `${FILE_EXPLORER_ERROR_MESSAGES.LOG_COPY_PATH_FAILED}`,
          error,
        )
      }
    },

    /**
     * 파일/폴더 이름 변경
     * @param item - 변경할 항목
     * @param newName - 새로운 이름
     */
    handleRename: (item: ItemInstance<FileNode>, newName: string) => {
      const trimmedName = newName.trim()
      if (!trimmedName) return

      const itemData = item.getItemData()
      const currentName = itemData.name

      if (trimmedName === currentName) return

      try {
        updateNode(itemData.path, { name: trimmedName })
        console.debug(
          `${FILE_EXPLORER_LOG_MESSAGES.LOG_ITEM_RENAMED} ${itemData.path} -> ${trimmedName}`,
        )
      } catch (error) {
        console.error(
          `${FILE_EXPLORER_ERROR_MESSAGES.LOG_RENAME_OPERATION_FAILED}`,
          error,
        )
        setError(FILE_EXPLORER_ERROR_MESSAGES.RENAME_ERROR)
      }
    },

    /**
     * 드래그 앤 드롭 처리
     * 현재는 구현되지 않음 - 서버 통신 연동 필요
     */
    handleDrop: (
      items: ItemInstance<FileNode>[],
      target: { item: ItemInstance<FileNode> },
    ) => {
      // TODO: 드롭 핸들러 구현 필요 - 서버 통신 연동
      console.debug(
        `${FILE_EXPLORER_LOG_MESSAGES.LOG_DROP_ITEMS}`,
        items,
        `${FILE_EXPLORER_LOG_MESSAGES.LOG_TO_TARGET}`,
        target,
      )
    },
  }
}
