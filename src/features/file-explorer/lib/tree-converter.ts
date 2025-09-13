import type { TreeNodeDto } from '@/features/file-explorer/types/api'
import type { FileNode, FileTree } from '@/features/file-explorer/types/client'

const PATH_SEPARATOR = '/'

// Path processing utility functions
const normalizePath = (path: string, isRoot = false): string => {
  if (isRoot && path === '') return PATH_SEPARATOR
  return path.startsWith(PATH_SEPARATOR) ? path : `${PATH_SEPARATOR}${path}`
}

/**
 * TreeNodeDto[]를 headless-tree에서 사용할 flat 구조로 변환
 * 이전 방식의 장점을 적용한 개선된 버전
 */
export const convertTreeNodeDtoToFileData = (
  nodes: TreeNodeDto[],
): FileTree => {
  if (!nodes || nodes.length === 0) return {}

  const tree: FileTree = {}

  const convertNode = (node: TreeNodeDto, isRoot = false) => {
    const normalizedPath = normalizePath(node.path, isRoot)

    const fileNode: FileNode = {
      id: node.id ? String(node.id) : normalizedPath,
      name: normalizedPath.split(PATH_SEPARATOR).pop() || normalizedPath,
      path: normalizedPath,
      isFolder: node.type === 'folder',
      ...(node.type === 'folder' && {
        children: node.children?.map(child => normalizePath(child.path)) || [],
      }),
    }

    tree[normalizedPath] = fileNode

    if (node.children) {
      node.children.forEach(child => {
        convertNode(child)
      })
    }
  }

  nodes.forEach(node => {
    convertNode(node, true)
  })

  return tree
}
