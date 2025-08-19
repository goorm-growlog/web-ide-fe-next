import type { DragTarget, ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

export const handleDrop = (
  _items: ItemInstance<FileNode>[],
  _target: DragTarget<FileNode>,
) => {
  console.debug('Dropped')
}
