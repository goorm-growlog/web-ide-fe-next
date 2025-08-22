import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

/**
 * 드래그 앤 드롭 영역 판단 관련 유틸리티 함수들
 *
 * 수정사항:
 * - isDropZone 로직을 컴포넌트에서 분리하여 테스트 가능하게 개선
 * - 드래그 앤 드롭 관련 비즈니스 로직을 한 곳으로 집중화
 * - 순수 함수로 만들어 다른 컴포넌트에서도 재사용 가능
 */

/**
 * 주어진 아이템이 드롭 영역인지 판단하는 함수
 *
 * 드롭 영역 조건:
 * 1. 현재 드래그 타겟인 경우
 * 2. 선택되지 않았으면서 드래그 타겟의 하위 항목인 경우
 *
 * @param itemInstance - 확인할 트리 아이템 인스턴스
 * @returns 드롭 영역 여부
 *
 * @example
 * ```tsx
 * const isDrop = isItemDropZone(treeItem)
 * ```
 */
export const isItemDropZone = (
  itemInstance: ItemInstance<FileNode>,
): boolean => {
  const isDragTarget = itemInstance.isDragTarget()
  const isSelected = itemInstance.isSelected()

  const dragTarget = itemInstance.getTree().getDragTarget()
  const isDescendantOfDragTarget =
    dragTarget?.item != null &&
    itemInstance.isDescendentOf(dragTarget.item.getId())

  return isDragTarget || (!isSelected && isDescendantOfDragTarget)
}
