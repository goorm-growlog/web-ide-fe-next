import type { TreeInstance } from '@headless-tree/core'

export type FileActionType =
  | 'newFile'
  | 'newFolder'
  | 'copyPath'
  | 'delete'
  | 'rename'

/**
 * 파일 노드 데이터 구조
 * @param id 노드의 고유 식별자
 * @param name 파일/폴더 이름
 * @param path 파일/폴더의 전체 경로
 * @param isFolder 폴더 여부
 * @param children 자식 노드들의 ID 배열
 */
export interface FileNode {
  id: string
  name: string
  path: string
  isFolder: boolean
  children?: string[]
}

/**
 * 파일 트리 훅의 반환 타입
 */
export interface FileTreeReturn {
  tree: TreeInstance<FileNode> | null
  isLoading: boolean
  error: string | null
  refresh: () => void
}
