import type { DragTarget, ItemInstance } from '@headless-tree/core'
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import type { FileNode } from '../model/types'
import { handleDrop } from './drop-handler'
import { handleRename } from './rename-handler'

/**
 * 파일 탐색기 트리 설정 관련 유틸리티 함수들
 */
export interface TreeConfigOptions {
  rootItemId: string
  fileTree: Record<string, FileNode>
  indent: number
}

/**
 * 파일 탐색기용 트리 설정을 생성하는 함수
 *
 * @param options - 트리 설정에 필요한 옵션들
 * @returns @headless-tree/core에서 사용할 트리 설정 객체
 *
 * @example
 * ```tsx
 * const config = createTreeConfig({
 *   rootItemId: '/',
 *   fileTree: mockFileTree,
 *   indent: 16
 * })
 * const tree = useTree<FileNode>(config)
 * ```
 */
export const createTreeConfig = ({
  rootItemId,
  fileTree,
  indent,
}: TreeConfigOptions) => {
  const dataLoader = {
    getItem: (itemId: string): FileNode =>
      fileTree[itemId] ??
      ({
        name: itemId,
        isFolder: false,
      } as FileNode),
    getChildren: (itemId: string) => fileTree[itemId]?.children ?? [],
  }

  return {
    rootItemId,
    getItemName: (item: ItemInstance<FileNode>) => item.getItemData().name,
    isItemFolder: (item: ItemInstance<FileNode>) =>
      Boolean(item.getItemData().isFolder),
    dataLoader,
    indent,
    canReorder: false,
    canDrop: (_items: ItemInstance<FileNode>[], target: DragTarget<FileNode>) =>
      target.item.isFolder(),
    onDrop: handleDrop,
    onRename: handleRename,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      renamingFeature,
    ],
  }
}
