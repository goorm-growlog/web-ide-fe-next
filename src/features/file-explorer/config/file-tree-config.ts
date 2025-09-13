import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  type ItemInstance,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import { useMemo } from 'react'
import { FILE_TREE_CONSTANTS } from '@/features/file-explorer/constants/file-tree-constants'
import { useFileOperations } from '@/features/file-explorer/lib/file-operations'
import type { FileNode } from '@/features/file-explorer/types/client'
import type { TreeDataLoader } from '@/features/file-explorer/types/tree'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'

const createDataLoader = (
  flatFileNodes: Record<string, FileNode> | null,
): TreeDataLoader => {
  return {
    getItem: (itemId: string): FileNode => {
      const nodeData = flatFileNodes?.[itemId]
      return (
        nodeData ?? {
          id: itemId,
          name: '',
          path: itemId,
          isFolder: false,
          children: [],
        }
      )
    },
    getChildren: (itemId: string): string[] => {
      const nodeChildren = flatFileNodes?.[itemId]?.children
      return nodeChildren || []
    },
  }
}

export const useFileTreeConfig = (
  flatFileNodes: Record<string, FileNode> | null,
) => {
  const { executeFileRename, executeFileMove } = useFileOperations()
  const dataLoader = createDataLoader(flatFileNodes)

  return useMemo(
    () => ({
      rootItemId: FILE_TREE_CONSTANTS.ROOT_PATH,
      getItemName: (item: ItemInstance<FileNode>) =>
        String(item.getItemData().name || ''),
      isItemFolder: (item: ItemInstance<FileNode>) =>
        item.getItemData().isFolder,
      dataLoader,
      indent: INDENT_SIZE_PX,
      features: [
        syncDataLoaderFeature,
        selectionFeature,
        dragAndDropFeature,
        hotkeysCoreFeature,
        renamingFeature,
      ],
      canReorder: false,
      canDrop: (
        _items: ItemInstance<FileNode>[],
        target: { item: ItemInstance<FileNode> },
      ) => target.item.isFolder(),
      onDrop: executeFileMove,
      onRename: executeFileRename,
    }),
    [dataLoader, executeFileRename, executeFileMove],
  )
}
