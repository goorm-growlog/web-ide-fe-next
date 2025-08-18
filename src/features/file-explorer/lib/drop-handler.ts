import type { DragTarget, ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

export const handleDrop = (
  items: ItemInstance<FileNode>[],
  target: DragTarget<FileNode>,
) => {
  console.log(
    '[onDrop]',
    '드래그된 아이템:',
    items.map(item => item.getId()),
    '드롭 타겟:',
    target.item.getId(),
  )
}
