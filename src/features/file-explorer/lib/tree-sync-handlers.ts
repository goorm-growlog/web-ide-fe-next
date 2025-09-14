import type React from 'react'
import { convertTreeDto } from '@/features/file-explorer/lib/tree-converter'
import {
  addChildToParent,
  getFileName,
  getParentPath,
  removeChildFromParent,
  removeSubtree,
  updateSubtreePaths,
} from '@/features/file-explorer/lib/tree-data-utils'
import type {
  FileTreeAddPayload,
  FileTreeMovePayload,
  FileTreeNodeDto,
  FileTreeRemovePayload,
} from '@/features/file-explorer/types/api'
import type { FileNode } from '@/features/file-explorer/types/client'
import { logger } from '@/shared/lib/logger'

/**
 * 트리 메시지 핸들러에 필요한 의존성
 * 파일 트리 작업을 위한 상태 관리 함수들을 제공
 */
export interface TreeMessageDependencies {
  setFlatFileNodes: React.Dispatch<
    React.SetStateAction<Record<string, FileNode> | null>
  >
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * WebSocket에서 오는 다양한 트리 메시지 핸들러들
 * 각 핸들러는 특정 유형의 트리 작업을 처리
 */
export interface TreeMessageHandlers {
  syncTreeInit: (payload: FileTreeNodeDto[]) => void
  syncTreeAdd: (payload: FileTreeAddPayload) => void
  syncTreeRemove: (payload: FileTreeRemovePayload) => void
  syncTreeMove: (payload: FileTreeMovePayload) => void
}

/**
 * 트리 메시지 핸들러를 생성하는 팩토리 함수
 * WebSocket 메시지를 파일 트리의 상태 업데이트로 변환
 *
 * @param {TreeMessageDependencies} dependencies - 상태 관리 함수들을 포함하는 의존성
 * @returns 모든 트리 메시지 핸들러를 포함하는 객체
 */
export const createTreeMessageHandlers = ({
  setFlatFileNodes,
  setIsLoading,
}: TreeMessageDependencies): TreeMessageHandlers => {
  /**
   * 서버로부터의 초기 트리 데이터 처리
   * 서버 DTO를 클라이언트 측 파일 노드로 변환하고 로딩을 false로 설정
   */
  const syncTreeInit = (payload: FileTreeNodeDto[]) => {
    try {
      if (!Array.isArray(payload)) {
        logger.error('Invalid tree init payload: expected array')
        return
      }

      const convertedTree = convertTreeDto(payload)
      setFlatFileNodes(convertedTree)
      setIsLoading(false)
    } catch (error) {
      logger.error('Failed to handle tree init:', error)
      setIsLoading(false)
    }
  }

  /**
   * 트리에 새로운 파일이나 폴더 추가 처리
   * 새로운 파일 노드를 생성하고 부모의 자식 배열을 업데이트
   */
  const syncTreeAdd = (payload: FileTreeAddPayload) => {
    if (!payload?.path || !payload?.type) {
      logger.error('Invalid tree add payload:', payload)
      return
    }

    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev) return prev

      // 성능 최적화: shallow copy 대신 직접 수정
      const fileName = getFileName(payload.path)
      const parentPath = getParentPath(payload.path)

      const newNode: FileNode = {
        id: payload.path,
        name: fileName,
        path: payload.path,
        isFolder: payload.type === 'folder',
        ...(payload.type === 'folder' && { children: [] }),
      }

      const updatedNodes = { ...prev, [payload.path]: newNode }

      // 부모 노드 업데이트
      if (prev[parentPath]) {
        const parentNode = prev[parentPath]
        updatedNodes[parentPath] = {
          ...parentNode,
          children: !parentNode.children?.includes(payload.path)
            ? [...(parentNode.children ?? []), payload.path]
            : (parentNode.children ?? []),
        }
      }

      return updatedNodes
    })
  }

  /**
   * 트리에서 파일이나 폴더 제거 처리 (최적화된 버전)
   * 노드를 제거하고 하위 노드들을 재귀적으로 삭제하며, 부모 노드의 참조를 정리
   */
  const syncTreeRemove = (payload: FileTreeRemovePayload) => {
    if (!payload?.path) {
      logger.error('Invalid tree remove payload:', payload)
      return
    }

    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev) return prev

      try {
        // 성능 최적화: 새 객체 생성 최소화
        const updatedNodes = { ...prev }

        // 재귀적으로 하위 노드들 삭제
        removeSubtree(updatedNodes, payload.path)

        // 부모 노드에서 삭제된 노드의 참조 제거
        const parentPath = getParentPath(payload.path)
        removeChildFromParent(updatedNodes, parentPath, payload.path)

        return updatedNodes
      } catch (error) {
        logger.error('Failed to remove tree node:', {
          path: payload.path,
          error,
        })
        return prev
      }
    })
  }

  /**
   * 트리에서 파일이나 폴더 이동 처리 (최적화된 버전)
   * 노드를 새로운 위치로 이동하고 하위 노드들의 경로를 재귀적으로 업데이트
   */
  const syncTreeMove = (payload: FileTreeMovePayload) => {
    if (!payload?.fromPath || !payload?.toPath) {
      logger.error('Invalid tree move payload:', payload)
      return
    }

    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev || !prev[payload.fromPath]) {
        logger.warn('Node to move not found:', payload.fromPath)
        return prev
      }

      try {
        // 순환 참조 검증: toPath가 fromPath의 하위 경로인지 확인
        if (payload.toPath.startsWith(`${payload.fromPath}/`)) {
          logger.error('Cannot move folder into itself:', {
            fromPath: payload.fromPath,
            toPath: payload.toPath,
          })
          return prev
        }

        const updatedNodes = { ...prev }

        // 대상 경로가 이미 존재하는지 확인
        if (updatedNodes[payload.toPath]) {
          logger.warn('Target path already exists:', payload.toPath)
          return prev
        }
        const nodeToMove = updatedNodes[payload.fromPath]

        // 하위 노드들의 경로를 재귀적으로 업데이트
        updateSubtreePaths(updatedNodes, payload.fromPath, payload.toPath)

        // 이동된 노드의 메타데이터 업데이트
        const newFileName = getFileName(payload.toPath)

        updatedNodes[payload.toPath] = {
          ...nodeToMove,
          id: payload.toPath,
          path: payload.toPath,
          name: newFileName,
          isFolder: nodeToMove?.isFolder ?? false,
        }

        // 이전 부모에서 참조 제거
        const oldParentPath = getParentPath(payload.fromPath)
        removeChildFromParent(updatedNodes, oldParentPath, payload.fromPath)

        // 새로운 부모에 참조 추가
        const newParentPath = getParentPath(payload.toPath)
        addChildToParent(updatedNodes, newParentPath, payload.toPath)

        return updatedNodes
      } catch (error) {
        logger.error('Failed to move tree node:', {
          fromPath: payload.fromPath,
          toPath: payload.toPath,
          error,
        })
        return prev
      }
    })
  }

  return {
    syncTreeInit,
    syncTreeAdd,
    syncTreeRemove,
    syncTreeMove,
  }
}
