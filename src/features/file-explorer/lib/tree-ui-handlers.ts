import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '@/features/file-explorer/types/client'
import type {
  TreeHandlerParams,
  TreeHandlers,
} from '@/features/file-explorer/types/tree'

/**
 * 트리 핸들러 팩토리 함수
 * 파일 트리에서 발생하는 이벤트를 처리하는 핸들러들을 생성
 *
 * @param params - 핸들러 생성에 필요한 파라미터들
 * @returns 트리 핸들러 인스턴스
 */
export const createTreeHandlers = ({
  onRename,
  onMove,
  onError,
}: TreeHandlerParams): TreeHandlers => ({
  /**
   * 파일/폴더 이름 변경 처리
   *
   * @param item - 변경할 아이템 인스턴스
   * @param value - 새로운 이름
   */
  handleTreeRename: (item: ItemInstance<FileNode>, value: string) => {
    try {
      const itemData = item.getItemData()
      onRename(itemData, value)
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  },

  /**
   * 드래그 앤 드롭 처리
   * 파일/폴더를 다른 위치로 이동
   *
   * @param items - 드래그된 아이템들 (첫 번째 아이템만 사용)
   * @param target - 드롭 대상 아이템
   */
  handleTreeDrop: (
    items: ItemInstance<FileNode>[],
    target: { item: ItemInstance<FileNode> },
  ) => {
    try {
      // 드래그된 아이템이 없으면 처리하지 않음
      const dragItem = items[0]
      if (!dragItem) return

      const dragData = dragItem.getItemData()
      const dropData = target.item.getItemData()

      // 드랍 아이템이 폴더가 아니거나 같은 위치이면 무시
      if (dragData.path === dropData.path || !dropData.isFolder) return

      // 이동 경로 생성 (파일명 충돌 방지)
      const fromPath = dragData.path
      const toPath = `${dropData.path}/${dragData.name}`

      // TODO: 실제 구현에서는 파일 시스템에서 중복 확인 필요
      // 현재는 기본 경로로 이동 (서버에서 충돌 처리)
      onMove(fromPath, toPath)
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  },
})
