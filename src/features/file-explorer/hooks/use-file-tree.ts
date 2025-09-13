import type { TreeInstance } from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { useEffect } from 'react'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { useFileTreeConfig } from '@/features/file-explorer/config/file-tree-config'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'
import { createMessageDispatcher } from '@/features/file-explorer/lib/message-dispatcher'
import { createTreeMessageHandlers } from '@/features/file-explorer/lib/tree-message-handlers'
import { useFileTreeStore } from '@/features/file-explorer/stores/file-tree-store'
import type {
  FileNode,
  FileTreeReturn,
} from '@/features/file-explorer/types/client'

/**
 * 파일 트리를 관리하는 커스텀 훅
 * WebSocket을 통한 실시간 파일 트리 데이터 관리
 *
 * @param projectId 프로젝트 ID
 * @returns 파일 트리 인스턴스와 관련 상태들
 */
const useFileTree = (projectId: string): FileTreeReturn => {
  const { subscribe, unsubscribe, publish, isConnected } = useWebSocketClient()
  const {
    flatFileNodes,
    isLoading,
    error,
    refresh,
    setFlatFileNodes,
    setIsLoading,
    setError,
  } = useFileTreeStore()

  const treeConfig = useFileTreeConfig(flatFileNodes)
  const tree: TreeInstance<FileNode> = useTree<FileNode>(treeConfig)

  /**
   * WebSocket 연결 시 파일 트리 구독 설정
   */
  useEffect(() => {
    if (!isConnected) return

    const handlers = createTreeMessageHandlers({
      setFlatFileNodes,
      setIsLoading,
    })

    const messageDispatcher = createMessageDispatcher({
      handlers,
      onError: setError,
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
  }, [
    isConnected,
    projectId,
    subscribe,
    unsubscribe,
    publish,
    setFlatFileNodes,
    setIsLoading,
    setError,
  ])

  /**
   * 파일 노드 데이터가 변경될 때 트리를 재구성
   */
  useEffect(() => {
    if (isLoading || !flatFileNodes || !tree) return
    if (Object.keys(flatFileNodes).length === 0) return

    tree.rebuildTree()
  }, [flatFileNodes, tree, isLoading])

  return {
    tree: isLoading || !flatFileNodes ? null : tree,
    isLoading,
    error,
    refresh,
  }
}

export default useFileTree
