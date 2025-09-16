import type { TreeInstance } from '@headless-tree/core'
import type { FileNode } from '@/entities/file-tree/model/types'

export type FileActionType =
  | 'newFile'
  | 'newFolder'
  | 'copyPath'
  | 'delete'
  | 'rename'

/**
 * 파일 트리 훅의 반환 타입
 */
export interface FileTreeReturn {
  tree: TreeInstance<FileNode>
  isLoading: boolean
}
