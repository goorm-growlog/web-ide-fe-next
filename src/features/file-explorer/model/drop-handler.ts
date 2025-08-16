import type { DragTarget, ItemInstance } from '@headless-tree/core'
import type { FileNode } from './types'

export const handleDrop = (
  items: ItemInstance<FileNode>[],
  target: DragTarget<FileNode>,
) => {
  // biome-ignore lint/suspicious/noConsole: 드롭 처리 로직 구현
  console.log(
    '[onDrop]',
    '드래그된 아이템:',
    items.map(item => item.getId()),
    '드롭 타겟:',
    target.item.getId(),
  )
}
