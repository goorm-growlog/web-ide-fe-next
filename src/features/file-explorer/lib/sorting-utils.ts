import type { FileNode } from '@/entities/file-tree/model/types'

/**
 * 파일트리 아이템들을 정렬하는 유틸리티 함수
 * 폴더가 먼저 오고, 파일이 나중에 오도록 정렬합니다.
 * 각 그룹 내에서는 알파벳 순으로 정렬합니다.
 *
 * @param children - 정렬할 자식 아이템들의 경로 배열
 * @param flatFileNodes - 모든 파일 노드들의 맵
 * @returns 정렬된 자식 아이템들의 경로 배열
 */
export const sortFileTreeChildren = (
  children: string[],
  flatFileNodes: Record<string, FileNode> | null,
): string[] => {
  if (!children || children.length === 0 || !flatFileNodes) {
    return children || []
  }

  return [...children].sort((a, b) => {
    const nodeA = flatFileNodes[a]
    const nodeB = flatFileNodes[b]

    // 노드가 존재하지 않는 경우 처리
    if (!nodeA || !nodeB) {
      return 0
    }

    // 폴더와 파일을 구분하여 정렬
    if (nodeA.type === 'folder' && nodeB.type === 'file') {
      return -1 // 폴더가 파일보다 앞에
    }
    if (nodeA.type === 'file' && nodeB.type === 'folder') {
      return 1 // 파일이 폴더보다 뒤에
    }

    // 같은 타입인 경우 알파벳 순으로 정렬
    const nameA = getItemNameFromPath(a)
    const nameB = getItemNameFromPath(b)

    return nameA.localeCompare(nameB, 'ko', {
      numeric: true,
      sensitivity: 'base',
    })
  })
}

/**
 * 파일 경로에서 아이템 이름을 추출하는 헬퍼 함수
 * @param path - 파일 경로
 * @returns 아이템 이름
 */
const getItemNameFromPath = (path: string): string => {
  if (!path) return ''
  const segments = path.split('/').filter(Boolean)
  return segments[segments.length - 1] || ''
}
