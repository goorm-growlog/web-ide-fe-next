import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

export const handleRename = (item: ItemInstance<FileNode>, value: string) => {
  item.getItemData().name = value
}
