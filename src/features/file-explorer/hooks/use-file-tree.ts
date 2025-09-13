import type { TreeInstance } from '@headless-tree/core'
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
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'
import { FILE_TREE_CONSTANTS } from '@/features/file-explorer/constants/file-tree-constants'
import { useFileOperations } from '@/features/file-explorer/lib/file-operations'
import { createMessageDispatcher } from '@/features/file-explorer/lib/message-dispatcher'
import { createTreeMessageHandlers } from '@/features/file-explorer/lib/tree-sync-handlers'
import type {
  FileNode,
  FileTreeReturn,
} from '@/features/file-explorer/types/client'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'
import { logger } from '@/shared/lib/logger'

/**
 * 파일 트리 상태 관리 훅
 * WebSocket을 통해 실시간 파일 트리 업데이트를 처리합니다.
 * 에러 처리는 페이지 레벨에서 관리됩니다.
 */
const useFileTree = (projectId: string): FileTreeReturn => {
  const { subscribe, unsubscribe, publish, isConnected } = useWebSocketClient()
  const [flatFileNodes, setFlatFileNodes] = useState<Record<
    string,
    FileNode
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 파일 트리 상태 초기화
   */
  const handleClear = useCallback(() => {
    setFlatFileNodes(null)
    setIsLoading(true)
  }, [])

  const { executeFileRename, executeFileMove } = useFileOperations()

  const dataLoader = useMemo(
    () => ({
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
    }),
    [flatFileNodes],
  )

  const treeConfig = useMemo(
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

  const tree: TreeInstance<FileNode> = useTree<FileNode>(treeConfig)

  /**
   * WebSocket 연결 시 파일 트리 구독 설정
   */
  useEffect(() => {
    if (!isConnected) return

    // 프로젝트 변경 시 이전 데이터 정리
    handleClear()

    const handlers = createTreeMessageHandlers({
      setFlatFileNodes,
      setIsLoading,
    })

    const messageDispatcher = createMessageDispatcher({
      handlers,
      onError: error => logger.error('File tree message error:', error),
    })

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

  return {
    tree,
    isLoading,
    clear: handleClear,
  }
}

export default useFileTree
