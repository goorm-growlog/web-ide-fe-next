import type { DragTarget, ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

// TODO: API
export const handleDrop = (
  items: ItemInstance<FileNode>[],
  target: DragTarget<FileNode>,
) => {
  if (!items || items.length === 0) return

  try {
    console.debug(
      'Dropped items: [{}] => {}',
      items.map(item => item.getItemName).join(', '),
      target,
    )
  } catch (error) {
    console.error('Drop operation failed:', error)
  }
}
