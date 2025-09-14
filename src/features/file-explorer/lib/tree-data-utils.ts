import type { FileNode } from '@/features/file-explorer/types/client'
import { logger } from '@/shared/lib/logger'

/**
 * 파일 경로에서 부모 경로를 계산하는 유틸리티 함수
 * @param path - 파일 경로
 * @returns 부모 경로
 */
export const getParentPath = (path: string): string => {
  if (!path || path === '/') return '/'

  const segments = path.split('/').filter(Boolean)
  return segments.length > 1 ? `/${segments.slice(0, -1).join('/')}` : '/'
}

/**
 * 파일 경로에서 파일명을 추출하는 유틸리티 함수
 * @param path - 파일 경로
 * @returns 파일명
 */
export const getFileName = (path: string): string => {
  if (!path) return ''

  const segments = path.split('/').filter(Boolean)
  return segments[segments.length - 1] || ''
}

/**
 * 트리에서 하위 노드들을 재귀적으로 찾는 유틸리티 함수
 * @param nodes - 모든 노드의 맵
 * @param rootPath - 루트 경로
 * @returns 하위 노드 경로들의 배열
 */
export const findSubtreePaths = (
  nodes: Record<string, FileNode>,
  rootPath: string,
): string[] => {
  if (!nodes || !rootPath) return []

  const subtreePaths: string[] = []
  const queue = [rootPath]

  while (queue.length > 0) {
    const currentPath = queue.shift()
    if (!currentPath) continue

    const node = nodes[currentPath]
    if (node?.children?.length) {
      subtreePaths.push(...node.children)
      queue.push(...node.children)
    }
  }

  return subtreePaths
}

/**
 * 트리에서 하위 노드들을 재귀적으로 삭제하는 유틸리티 함수
 * @param nodes - 모든 노드의 맵 (mutable)
 * @param rootPath - 삭제할 루트 경로
 * @returns 삭제된 노드 경로들의 Set
 */
export const removeSubtree = (
  nodes: Record<string, FileNode>,
  rootPath: string,
): Set<string> => {
  const removedPaths = new Set<string>()

  try {
    const subtreePaths = findSubtreePaths(nodes, rootPath)

    // 하위 노드들 먼저 삭제
    for (const path of subtreePaths) {
      delete nodes[path]
      removedPaths.add(path)
    }

    // 루트 노드 삭제
    delete nodes[rootPath]
    removedPaths.add(rootPath)
  } catch (error) {
    logger.error('Failed to remove subtree:', { rootPath, error })
  }

  return removedPaths
}

/**
 * 트리에서 하위 노드들의 경로를 업데이트하는 유틸리티 함수
 * @param nodes - 모든 노드의 맵 (mutable)
 * @param oldPath - 이전 경로
 * @param newPath - 새로운 경로
 */
export const updateSubtreePaths = (
  nodes: Record<string, FileNode>,
  oldPath: string,
  newPath: string,
): void => {
  if (!nodes || !oldPath || !newPath) return

  try {
    const childPaths = findSubtreePaths(nodes, oldPath)
    const pathMappings = new Map<string, string>()

    // 모든 하위 노드의 새 경로 계산
    for (const path of childPaths) {
      if (path.startsWith(`${oldPath}/`)) {
        const relativePath = path.substring(oldPath.length)
        pathMappings.set(path, `${newPath}${relativePath}`)
      }
    }

    // 루트 노드도 매핑에 추가
    pathMappings.set(oldPath, newPath)

    // 경로 업데이트 실행 (역순으로 처리하여 경로 충돌 방지)
    const sortedPaths = Array.from(pathMappings.keys()).sort(
      (a, b) => b.length - a.length,
    )

    for (const oldPathKey of sortedPaths) {
      const newPathKey = pathMappings.get(oldPathKey)
      if (newPathKey && nodes[oldPathKey]) {
        nodes[newPathKey] = {
          ...nodes[oldPathKey],
          id: newPathKey,
          path: newPathKey,
          name: getFileName(newPathKey),
        }
        delete nodes[oldPathKey]
      }
    }
  } catch (error) {
    logger.error('Failed to update subtree paths:', { oldPath, newPath, error })
  }
}

/**
 * 부모 노드에서 자식 참조를 제거하는 헬퍼 함수
 * @param nodes - 모든 노드의 맵 (mutable)
 * @param parentPath - 부모 경로
 * @param childPath - 제거할 자식 경로
 */
export const removeChildFromParent = (
  nodes: Record<string, FileNode>,
  parentPath: string,
  childPath: string,
): void => {
  const parentNode = nodes[parentPath]
  if (!parentNode?.children) return

  const remainingChildren = parentNode.children.filter(
    (child: string) => child !== childPath,
  )

  // 참조만 변경하고 객체는 재사용
  parentNode.children = remainingChildren
}

/**
 * 부모 노드에 자식 참조를 추가하는 헬퍼 함수
 * @param nodes - 모든 노드의 맵 (mutable)
 * @param parentPath - 부모 경로
 * @param childPath - 추가할 자식 경로
 */
export const addChildToParent = (
  nodes: Record<string, FileNode>,
  parentPath: string,
  childPath: string,
): void => {
  const parentNode = nodes[parentPath]
  if (!parentNode) return

  const currentChildren = parentNode.children ?? []
  if (!currentChildren.includes(childPath)) {
    parentNode.children = [...currentChildren, childPath]
  }
}
