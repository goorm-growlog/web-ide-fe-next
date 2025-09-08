import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { mockFileTree } from '@/features/file-explorer/fixtures/mock'
import { handleDrop } from '@/features/file-explorer/lib/drop-handler'
import { handleRename } from '@/features/file-explorer/lib/rename-handler'
import type { FileNode } from '@/features/file-explorer/model/types'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'

interface FileTreeProps {
  rootId: string
}

const useFileTree = ({ rootId: rootItemId }: FileTreeProps) => {
  const fileTree = mockFileTree

  const tree = useTree<FileNode>({
    rootItemId,
    getItemName: item => item.getItemData().name,
    isItemFolder: item => Boolean(item.getItemData().isFolder),
    dataLoader: {
      getItem: (itemId: string) =>
        fileTree[itemId] ?? {
          name: itemId,
          isFolder: false,
        },
      getChildren: (itemId: string) => fileTree[itemId]?.children ?? [],
    },
    indent: INDENT_SIZE_PX,
    canReorder: false,
    canDrop: (_, target) => target.item.isFolder(),
    onDrop: handleDrop,
    onRename: handleRename,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      renamingFeature,
    ],
  })

  return {
    containerProps: tree.getContainerProps(),
    items: tree.getItems(),
    tree,
  }
}

export default useFileTree
