import type { TreeConfig, TreeInstance } from '@headless-tree/core'
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  type ItemInstance,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFileOperations } from '@/entities/file-tree/hooks/use-file-operations'
import type { FileNode } from '@/entities/file-tree/model/types'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'
import { FILE_TREE_CONSTANTS } from '@/features/file-explorer/constants/file-tree-constants'
import { createTreeMessageHandlers } from '@/features/file-explorer/lib/tree-sync-handlers'
import {
  FILE_TREE_MESSAGE_TYPES,
  type FileTreeServerMessage,
} from '@/features/file-explorer/types/api'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'
import { logger } from '@/shared/lib/logger'

interface UseFileTreeProps {
  projectId: string
  isConnected: boolean
}

/**
 * 파일 트리 상태 관리 훅
 * WebSocket 구독을 통해 실시간 파일 트리 업데이트를 처리합니다.
 * WebSocket 연결은 외부에서 관리됩니다.
 */
const useFileTree = ({
  projectId,
  isConnected,
}: UseFileTreeProps): FileTreeReturn => {
  const { subscribe, unsubscribe, publish } = useWebSocketClient()
  const [flatFileNodes, setFlatFileNodes] = useState<Record<
    string,
    FileNode
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { executeFileRename, executeFileMove } = useFileOperations(projectId)

  const dataLoader = useMemo(
    () => ({
      getItem: (itemId: string): FileNode => {
        const nodeData = flatFileNodes?.[itemId]
        return (
          nodeData ?? {
            id: itemId,
            path: itemId,
            type: 'file',
            children: [],
          }
        )
      },
      getChildren: (itemId: string): string[] => {
        const nodeChildren = flatFileNodes?.[itemId]?.children
        return nodeChildren || []
      },
    }),
    [flatFileNodes],
  )

  const treeConfig: TreeConfig<FileNode> = useMemo(
    () => ({
      rootItemId: FILE_TREE_CONSTANTS.ROOT_PATH,
      getItemName: (item: ItemInstance<FileNode>) => {
        const path = item.getItemData().path
        if (!path) return ''
        const segments = path.split('/').filter(Boolean)
        return segments[segments.length - 1] || ''
      },
      isItemFolder: (item: ItemInstance<FileNode>) =>
        item.getItemData().type === 'folder' ||
        item.getId() === FILE_TREE_CONSTANTS.ROOT_PATH,
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
      canDrag: (items: ItemInstance<FileNode>[]) => {
        return items.every(
          item => item.getId() !== FILE_TREE_CONSTANTS.ROOT_PATH,
        )
      },
      canDrop: (
        _items: ItemInstance<FileNode>[],
        target: { item: ItemInstance<FileNode> },
      ) => {
        const isTargetFolder = target.item.isFolder()
        const isRootFile =
          !isTargetFolder &&
          target.item.getId().startsWith('/') &&
          !target.item.getId().includes('/', 1)
        return isTargetFolder || isRootFile
      },
      onDrop: (
        items: ItemInstance<FileNode>[],
        target: { item: ItemInstance<FileNode> },
      ) => {
        const targetItem = target.item
        if (targetItem) {
          for (const draggedItem of items) {
            // 드롭 타겟이 폴더면 그대로, 파일이면 부모 디렉토리로 이동
            let finalTargetPath: string

            if (targetItem.isFolder()) {
              // 폴더에 드롭: 해당 폴더 내부로 이동
              finalTargetPath = targetItem.getId()
            } else {
              // 파일에 드롭: 해당 파일의 부모 디렉토리로 이동
              const parentItem = targetItem.getParent()
              finalTargetPath =
                parentItem?.getId() || FILE_TREE_CONSTANTS.ROOT_PATH
            }

            executeFileMove(draggedItem.getId(), finalTargetPath)
          }
        }
      },
      onRename: (item: ItemInstance<FileNode>, newName: string) => {
        executeFileRename(item.getId(), newName)
      },
    }),
    [dataLoader, executeFileRename, executeFileMove],
  )

  const tree: TreeInstance<FileNode> = useTree<FileNode>(treeConfig)
  /**
   * 파일 트리 상태 초기화
   */
  const handleClear = useCallback(() => {
    setFlatFileNodes(null)
    setIsLoading(true)
  }, [])

  /**
   * WebSocket 연결 시 파일 트리 구독 설정
   */
  useEffect(() => {
    if (!isConnected || !projectId) return

    // 프로젝트 변경 시 이전 데이터 정리
    handleClear()

    const handlers = createTreeMessageHandlers({
      setFlatFileNodes,
      setIsLoading,
    })

    // 파일 트리 구독 설정
    const messageDispatcher = (message: { body: string }) => {
      try {
        const data: FileTreeServerMessage = JSON.parse(message.body)

        switch (data.type) {
          case FILE_TREE_MESSAGE_TYPES.TREE_INIT:
            handlers.syncTreeInit(data.payload)
            break
          case FILE_TREE_MESSAGE_TYPES.TREE_ADD:
            handlers.syncTreeAdd(data.payload)
            break
          case FILE_TREE_MESSAGE_TYPES.TREE_REMOVE:
            handlers.syncTreeRemove(data.payload)
            break
          case FILE_TREE_MESSAGE_TYPES.TREE_MOVE:
            handlers.syncTreeMove(data.payload)
            break
          default: {
            const unknownError = `Unknown file tree message type: ${String(data)}`
            logger.warn(unknownError)
          }
        }
      } catch (parseError) {
        logger.error('File tree message parsing failed:', parseError)
      }
    }

    // 파일 트리 구독
    const subId = subscribe(
      FILE_EXPLORER_WEBSOCKET_CONFIG.DESTINATIONS.SUBSCRIBE(projectId),
      messageDispatcher,
    )

    if (subId) {
      publish({
        destination:
          FILE_EXPLORER_WEBSOCKET_CONFIG.DESTINATIONS.PUBLISH_INIT(projectId),
      })
    }

    return () => {
      if (subId) unsubscribe(subId)
    }
  }, [isConnected, projectId, subscribe, unsubscribe, publish, handleClear])

  useEffect(() => {
    if (isLoading || !flatFileNodes || !tree) return
    if (Object.keys(flatFileNodes).length === 0) return

    tree.rebuildTree()
  }, [flatFileNodes, tree, isLoading])

  useEffect(() => {
    return () => handleClear()
  }, [handleClear])

  return {
    tree,
    isLoading,
  }
}

export default useFileTree
