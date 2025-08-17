import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from './types'

export const handleRename = (item: ItemInstance<FileNode>, value: string) => {
  console.log(`Renamed ${item.getItemName()} to ${value}`)
  item.getItemData().name = value
}
