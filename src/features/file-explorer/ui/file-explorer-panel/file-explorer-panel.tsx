'use client'

import type { DragTarget, ItemInstance } from '@headless-tree/core'
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { mockFileTree } from '@/features/file-explorer/fixtures/mock-data'
import { handleDrop } from '@/features/file-explorer/lib/drop-handler'
import { handleRename } from '@/features/file-explorer/lib/rename-handler'
import {
  ICON_SIZE,
  INDENT_SIZE,
} from '@/features/file-explorer/model/constants'
import type { FileNode } from '@/features/file-explorer/model/types'
import FileExplorerItem from '@/features/file-explorer/ui/file-explorer-item/file-explorer-item'
import styles from './file-explorer-panel.module.css'

interface FileExplorerPanelProps {
  rootItemId?: string
  fileTree?: Record<string, FileNode>
}

// 트리 설정을 생성하는 헬퍼 함수
const createTreeConfig = (
  rootItemId: string,
  fileTree: Record<string, FileNode>,
) => {
  const dataLoader = {
    getItem: (itemId: string) => fileTree[itemId] ?? { name: itemId },
    getChildren: (itemId: string) => fileTree[itemId]?.children ?? [],
  }

  return {
    rootItemId,
    getItemName: (item: ItemInstance<FileNode>) => item.getItemData().name,
    isItemFolder: (item: ItemInstance<FileNode>) =>
      Boolean(item.getItemData().isFolder),
    dataLoader,
    indent: INDENT_SIZE,
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

export const FileExplorerPanel = ({
  rootItemId = '/',
  fileTree = mockFileTree,
}: FileExplorerPanelProps) => {
  const treeConfig = createTreeConfig(rootItemId, fileTree)
  const tree = useTree<FileNode>(treeConfig)

  return (
    <div {...tree.getContainerProps()} className={styles.container}>
      {tree.getItems().map(item => (
        <FileExplorerItem
          key={item.getId()}
          item={item}
          indent={INDENT_SIZE}
          iconSize={ICON_SIZE}
        />
      ))}
    </div>
  )
}

export default FileExplorerPanel
