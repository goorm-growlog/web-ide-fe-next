import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

export const handleRename = (item: ItemInstance<FileNode>, value: string) => {
  const trimmedValue = value.trim()

  if (trimmedValue === '' || trimmedValue === item.getItemData().name) {
    return
  }

  try {
    // 임시로 직접 업데이트 (향후 개선 필요)
    item.getItemData().name = trimmedValue

    // TODO: 형제 이름 충돌 검사 (부모/컬렉션 조회가 가능한 경우)
    // const parent = item.getParent()
    // const siblings = parent?.getChildren() || []
    // const hasNameConflict = siblings.some(sibling =>
    //   sibling !== item && sibling.getItemData().name === trimmedValue
    // )
    // if (hasNameConflict) { /* 충돌 처리 */ }
  } catch (error) {
    console.error('Rename operation failed:', error)
    // TODO: 앱의 중앙 모니터링/리포팅 API로 에러 전달
  }
}
