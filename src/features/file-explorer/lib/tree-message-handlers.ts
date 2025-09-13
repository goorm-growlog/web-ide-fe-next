import type React from 'react'
import { convertTreeNodeDtoToFileData } from '@/features/file-explorer/lib/tree-converter'
import type {
  FileTreeAddPayload,
  FileTreeMovePayload,
  FileTreeNodeDto,
  FileTreeRemovePayload,
} from '@/features/file-explorer/types/api'
import type { FileNode } from '@/features/file-explorer/types/client'

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
  handleTreeInit: (payload: FileTreeNodeDto[]) => void
  handleTreeAdd: (payload: FileTreeAddPayload) => void
  handleTreeRemove: (payload: FileTreeRemovePayload) => void
  handleTreeMove: (payload: FileTreeMovePayload) => void
}

/**
 * 트리 메시지 핸들러를 생성하는 팩토리 함수
 * WebSocket 메시지를 파일 트리의 상태 업데이트로 변환
 *
 * @param {TreeMessageDependencies} TreeMessageDependencies - 상태 관리 함수들을 포함하는 의존성
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
  const handleTreeInit = (payload: FileTreeNodeDto[]) => {
    const tree = convertTreeNodeDtoToFileData(payload)
    setFlatFileNodes(tree)
    setIsLoading(false)
  }

  /**
   * 트리에 새로운 파일이나 폴더 추가 처리
   * 새로운 파일 노드를 생성하고 부모의 자식 배열을 업데이트
   */
  const handleTreeAdd = (payload: FileTreeAddPayload) => {
    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev) return prev

      const pathSegments = payload.path.split('/')
      const fileName = pathSegments[pathSegments.length - 1]
      const parentPath = pathSegments.slice(0, -1).join('/') || '/'

      const newNode: FileNode = {
        id: payload.path,
        name: fileName || '',
        path: payload.path,
        isFolder: payload.type === 'folder',
        ...(payload.type === 'folder' && { children: [] }),
      }

      const updated = { ...prev, [payload.path]: newNode }
      if (prev[parentPath]) {
        updated[parentPath] = {
          ...prev[parentPath],
          children: [...(prev[parentPath].children || []), payload.path],
        }
      }

      return updated
    })
  }

  /**
   * 트리에서 파일이나 폴더 제거 처리
   * 노드를 제거하고 부모 노드들의 참조를 정리
   */
  const handleTreeRemove = (payload: FileTreeRemovePayload) => {
    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev) return prev

      const updated = { ...prev }
      delete updated[payload.path]

      // 삭제된 노드에 대한 참조를 모든 부모 노드에서 제거
      Object.keys(updated).forEach(key => {
        const node = updated[key]
        if (node?.children) {
          updated[key] = {
            ...node,
            children: node.children.filter(
              (child: string) => child !== payload.path,
            ),
          }
        }
      })

      return updated
    })
  }

  /**
   * 트리에서 파일이나 폴더 이동 처리
   * 노드를 새로운 위치로 이동하고 관련된 모든 참조를 업데이트
   */
  const handleTreeMove = (payload: FileTreeMovePayload) => {
    setFlatFileNodes((prev: Record<string, FileNode> | null) => {
      if (!prev || !prev[payload.fromPath]) return prev

      const updated = { ...prev }
      const nodeToMove = updated[payload.fromPath]

      delete updated[payload.fromPath]

      const pathSegments = payload.toPath.split('/')
      const newFileName = pathSegments[pathSegments.length - 1]
      const newParentPath = pathSegments.slice(0, -1).join('/') || '/'

      updated[payload.toPath] = {
        ...nodeToMove,
        id: payload.toPath,
        path: payload.toPath,
        name: newFileName || '',
        isFolder: nodeToMove?.isFolder || false,
      }

      // 모든 노드의 자식 배열에서 이동된 노드의 참조를 업데이트
      Object.keys(updated).forEach(key => {
        const node = updated[key]
        if (node?.children) {
          const filteredChildren = node.children.filter(
            (child: string) => child !== payload.fromPath,
          )
          const finalChildren =
            key === newParentPath && !filteredChildren.includes(payload.toPath)
              ? [...filteredChildren, payload.toPath]
              : filteredChildren

          updated[key] = {
            ...node,
            children: finalChildren,
          }
        }
      })

      return updated
    })
  }

  return {
    handleTreeInit,
    handleTreeAdd,
    handleTreeRemove,
    handleTreeMove,
  }
}
